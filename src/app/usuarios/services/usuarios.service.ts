import { Injectable, signal, computed, inject } from '@angular/core';

import { injectQuery } from '@tanstack/angular-query-experimental';

import { Usuario } from '@usuarios/intefaces';
import { getUsuarios } from '@usuarios/actions/get-usuarios.action';
import { saveUsuario } from '@usuarios/actions/save-usuarios.action';
import { AlertasService } from '@shared/services/alertas.service';
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

  queryUsuarios = injectQuery(() => ({
    queryKey: ['usuarios'],
    queryFn: () => getUsuarios(),
  }));

  private _usuarioAEditar = signal<Usuario | null>(null);
  public usuarioAEditar = this._usuarioAEditar.asReadonly();

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
}
