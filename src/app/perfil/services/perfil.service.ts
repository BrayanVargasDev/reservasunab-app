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
import { getPerfil, cambiarPassword, CambiarPasswordRequest } from '../actions';
import { AuthService } from '@auth/services/auth.service';
import { saveUsuario } from '@usuarios/actions';
import { getCiudades, getRegimenesTributarios } from '@shared/actions';
import {
  PaginatedResponse,
  RegimenTributario,
  Ciudad,
} from '@shared/interfaces';

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

  public ciudadesQuery = injectQuery(() => ({
    queryKey: ['ciudades'],
    queryFn: () => getCiudades(this.http),
    staleTime: 30 * 60 * 1000, // 30 minutos - las ciudades no cambian frecuentemente
    gcTime: 60 * 60 * 1000, // 1 hora
  }));

  public regimenesTributariosQuery = injectQuery(() => ({
    queryKey: ['regimenes-tributarios'],
    queryFn: () => getRegimenesTributarios(this.http),
    select: (response: PaginatedResponse<RegimenTributario>) => response,
    staleTime: 60 * 60 * 1000, // 1 hora - los regímenes tributarios cambian muy raramente
    gcTime: 2 * 60 * 60 * 1000, // 2 horas
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

  public cambiarPasswordMutation = injectMutation(() => ({
    mutationFn: async (datosPassword: CambiarPasswordRequest) => {
      return await cambiarPassword(this.http, datosPassword);
    },
    onSuccess: data => {
      console.log('Contraseña cambiada exitosamente:', data.message);
    },
    onError: error => {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    },
  }));

  public usuario = computed(() => this.perfilQuery.data());
  public ciudades = computed(() => this.ciudadesQuery.data()?.data || []);
  public ciudadesCargando = computed(() => this.ciudadesQuery.isLoading());
  public ciudadesError = computed(() => this.ciudadesQuery.error());

  public regimenesTributarios = computed(
    () => this.regimenesTributariosQuery.data()?.data || [],
  );
  public regimenesTributariosCargando = computed(() =>
    this.regimenesTributariosQuery.isLoading(),
  );
  public regimenesTributariosError = computed(() =>
    this.regimenesTributariosQuery.error(),
  );

  public cargando = computed(
    () =>
      this.perfilQuery.isLoading() ||
      this.actualizarPerfilMutation.isPending() ||
      this.cambiarPasswordMutation.isPending(),
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

  public async cambiarPassword(
    datosPassword: CambiarPasswordRequest,
  ): Promise<boolean> {
    try {
      const result = await this.cambiarPasswordMutation.mutateAsync(
        datosPassword,
      );

      if (result.status === 'success') {
        return true;
      } else {
        // Si el servidor responde con status diferente a 'success', mostrar el mensaje de error
        throw new Error(
          result.message || result.error || 'Error al cambiar la contraseña',
        );
      }
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);

      // Re-lanzar el error para que el componente pueda manejarlo
      if (error?.error?.message) {
        throw new Error(error.error.message);
      } else if (error?.message) {
        throw new Error(error.message);
      } else {
        throw new Error(
          'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.',
        );
      }
    }
  }

  // Métodos para manejo de ciudades
  public filtrarCiudades(termino: string): Ciudad[] {
    const todasLasCiudades = this.ciudades();

    if (!termino || termino.trim() === '') {
      return todasLasCiudades;
    }

    return todasLasCiudades.filter(ciudad =>
      ciudad.nombre.toLowerCase().includes(termino.toLowerCase()),
    );
  }

  public buscarCiudadPorId(id: number): Ciudad | undefined {
    return this.ciudades().find(ciudad => ciudad.id === id);
  }

  public buscarCiudadPorNombre(nombre: string): Ciudad | undefined {
    return this.ciudades().find(
      ciudad => ciudad.nombre.toLowerCase() === nombre.toLowerCase(),
    );
  }

  public async refrescarCiudades() {
    return await this.ciudadesQuery.refetch();
  }

  public invalidarCiudades() {
    this.queryClient.invalidateQueries({ queryKey: ['ciudades'] });
  }
}
