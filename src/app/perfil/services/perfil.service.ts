import { Injectable, signal, computed, inject } from '@angular/core';
import {
  QueryClient,
  injectQuery,
  injectMutation,
} from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '@usuarios/intefaces';
import { FormUtils } from '@shared/utils/form.utils';
import { AlertasService } from '@shared/services/alertas.service';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { getPerfil } from '../actions/get-perfil.action';
import { AuthService } from '@auth/services/auth.service';
import { saveUsuario } from '@usuarios/actions';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private http = inject(HttpClient);
  private alertaService = inject(AlertasService);
  private queryClient = inject(QueryClient);
  private authService = inject(AuthService);

  private _i18nDatePicker = signal(i18nDatePicker);
  public i18nDatePicker = this._i18nDatePicker.asReadonly();

  public perfilQuery = injectQuery(() => ({
    queryKey: ['perfil', this.authService.usuario()?.id],
    queryFn: async () => {
      const userId = this.authService.usuario()?.id;
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const { data: usuario } = await getPerfil(this.http, userId);
      if (!usuario) {
        throw new Error('No se pudo obtener el perfil del usuario');
      }

      return usuario;
    },
    enabled: computed(() => !!this.authService.usuario()?.id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }));

  public actualizarPerfilMutation = injectMutation(() => ({
    mutationFn: async (datosUsuario: Usuario) => {
      return await saveUsuario(this.http, datosUsuario, true, true);
    },
    onSuccess: (data, variables) => {
      this.queryClient.invalidateQueries({ queryKey: ['perfil'] });
      this.queryClient.setQueryData(['perfil', variables.id], variables);
    },
    onError: error => {
      console.error('Error al actualizar el perfil:', error);
    },
  }));

  public usuario = computed(() => this.perfilQuery.data());
  public cargando = computed(
    () =>
      this.perfilQuery.isLoading() || this.actualizarPerfilMutation.isPending(),
  );
  public error = computed(() => this.perfilQuery.error());

  public async obtenerPerfilUsuario(): Promise<Usuario | null> {
    try {
      await this.perfilQuery.refetch();
      return this.perfilQuery.data() || null;
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      return null;
    }
  }

  public async actualizarPerfil(datosUsuario: Usuario): Promise<boolean> {
    try {
      await this.actualizarPerfilMutation.mutateAsync(datosUsuario);
      return true;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      return false;
    }
  }

  // Métodos para invalidar y refrescar datos
  public invalidarPerfil() {
    this.queryClient.invalidateQueries({ queryKey: ['perfil'] });
  }

  public async refrescarPerfil() {
    return await this.perfilQuery.refetch();
  }
}
