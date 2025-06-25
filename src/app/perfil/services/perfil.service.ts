import { Injectable, signal, computed, inject } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { Usuario } from '@usuarios/intefaces';
import { FormUtils } from '@shared/utils/form.utils';
import { AlertasService } from '@shared/services/alertas.service';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private alertaService = inject(AlertasService);
  private queryClient = inject(QueryClient);

  private _usuario = signal<Usuario | null>(null);
  private _cargando = signal(false);
  private _i18nDatePicker = signal(i18nDatePicker);

  public usuario = this._usuario.asReadonly();
  public cargando = this._cargando.asReadonly();
  public i18nDatePicker = this._i18nDatePicker.asReadonly();

  public setUsuario(usuario: Usuario | null) {
    this._usuario.set(usuario);
  }

  public setCargando(estado: boolean) {
    this._cargando.set(estado);
  }

  // Simular obtener datos del usuario actual desde localStorage o API
  public async obtenerPerfilUsuario(): Promise<Usuario | null> {
    this._cargando.set(true);

    try {
      // Aquí iría la llamada real a la API
      // Por ahora simulamos con datos de ejemplo
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usuarioEjemplo: Usuario = {
        id: 1,
        avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        email: 'usuario@unab.edu.co',
        tipoUsuario: 'externo' as any,
        telefono: '3001234567',
        rol: 'Usuario',
        tipoDocumento: 1,
        documento: '12345678',
        nombre: 'Juan Carlos',
        apellido: 'Pérez González',
        ultimoAcceso: new Date().toISOString(),
        estado: 'activo' as any,
        fechaCreacion: new Date().toISOString(),
        direccion: 'Calle 45 # 123-45, Bucaramanga',
        fechaNacimiento: '1990-05-15',
      };

      this._usuario.set(usuarioEjemplo);
      return usuarioEjemplo;
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      return null;
    } finally {
      this._cargando.set(false);
    }
  }

  public async actualizarPerfil(datosUsuario: Partial<Usuario>): Promise<boolean> {
    this._cargando.set(true);

    try {
      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular actualización exitosa
      const usuarioActualizado = {
        ...this._usuario(),
        ...datosUsuario,
      } as Usuario;

      this._usuario.set(usuarioActualizado);
      return true;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      return false;
    } finally {
      this._cargando.set(false);
    }
  }

  public async subirAvatar(archivo: File): Promise<string | null> {
    this._cargando.set(true);

    try {
      // Aquí iría la llamada real a la API para subir la imagen
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular URL de la imagen subida
      const urlImagen = URL.createObjectURL(archivo);

      if (this._usuario()) {
        this._usuario.update(usuario => ({
          ...usuario!,
          avatar: urlImagen,
        }));
      }

      return urlImagen;
    } catch (error) {
      console.error('Error al subir el avatar:', error);
      return null;
    } finally {
      this._cargando.set(false);
    }
  }
}
