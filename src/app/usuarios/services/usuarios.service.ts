import { Injectable, signal, computed, inject } from '@angular/core';

import { injectQuery } from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';

import { Usuario } from '@usuarios/intefaces';
import { getUsuarios } from '@usuarios/actions/get-usuarios.action';
import { saveUsuario } from '@usuarios/actions/save-usuarios.action';
import { AlertasService } from '@shared/services/alertas.service';
import { Meta } from '@shared/interfaces';
import { i18nTablaUsuarios } from '../constants/lenguaje.constant';
import { PaginatedResponse } from '../../shared/interfaces/paginatd-response.interface';
import {
  updateUsuarioRol,
  updateUsuarioEstado,
  deleteUsuario,
} from '../actions';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private alertaService = inject(AlertasService);

  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  private _datosPaginador = signal<Meta | null>(null);

  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());

  queryUsuarios = injectQuery(() => ({
    queryKey: ['usuarios', this.paginacion()],
    queryFn: () => getUsuarios(this.paginacion()),
    select: (response: PaginatedResponse<Usuario>) => {
      this._datosPaginador.set(response.meta);

      const nuevoPageIndex = response.meta.current_page - 1;
      const nuevoPageSize = response.meta.per_page;


      const paginacionActual = this.paginacion();

      if (
        paginacionActual.pageIndex !== nuevoPageIndex ||
        paginacionActual.pageSize !== nuevoPageSize
      ) {
        this._paginacion.set({
          pageIndex: nuevoPageIndex,
          pageSize: nuevoPageSize,
        });
      }

      return response.data;
    },
  }));

  private _usuarioAEditar = signal<Usuario | null>(null);
  public usuarioAEditar = this._usuarioAEditar.asReadonly();
  private _i18nDatePicker = signal(i18nTablaUsuarios);
  public i18nDatePicker = this._i18nDatePicker.asReadonly();

  public setUsuarioAEditar(usuario: Usuario | null) {
    this._usuarioAEditar.set(usuario);
  }

  // Gestion de la modal de usuarios
  private _modalAbierta = signal(false);
  public modalAbierta = this._modalAbierta.asReadonly();
  private _modoEdicion = signal(false);
  public modoEdicion = this._modoEdicion.asReadonly();
  public abrirModal() {
    this._modalAbierta.set(true);
  }
  public cerrarModal() {
    this._modalAbierta.set(false);
    this._modoEdicion.set(false);
    this._usuarioAEditar.set(null);
  }

  public setModoEdicion(modo: boolean) {
    this._modoEdicion.set(modo);
  }

  public colorModal = computed(() => {
    return this._modoEdicion() ? 'secondary' : 'primary';
  });

  public tituloModal = computed(() => {
    return this._modoEdicion() ? 'Editar Usuario' : 'Nuevo Usuario';
  });

  public guardarUsuario(usuario: Usuario) {
    return saveUsuario(usuario, this._modoEdicion(), true);
  }

  public async eliminarUsuario(usuarioId: number): Promise<void> {
    return deleteUsuario(usuarioId);
  }

  public async activarUsuario(usuarioId: number): Promise<Usuario> {
    return updateUsuarioEstado(usuarioId, 'activo');
  }

  public async cambiarRolUsuario(
    usuarioId: number,
    nuevoRol: string,
  ): Promise<Usuario> {
    return updateUsuarioRol(usuarioId, nuevoRol);
  }

  public async cambiarEstadoUsuario(
    usuarioId: number,
    nuevoEstado: string,
  ): Promise<Usuario> {
    return updateUsuarioEstado(usuarioId, nuevoEstado);
  }

  public setPaginacion(paginacion: PaginationState) {
    this._paginacion.set(paginacion);
  }

  public setDatosPaginador(datos: Partial<Meta>) {
    this._datosPaginador.update(
      state =>
        ({
          ...state,
          ...datos,
        } as Meta),
    );
  }
}
