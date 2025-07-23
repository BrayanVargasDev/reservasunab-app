import { Injectable, signal, computed, inject } from '@angular/core';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { HttpClient } from '@angular/common/http';

import { PaginationState } from '@tanstack/angular-table';

import { getPermisos } from '../actions';
import { AppService } from '@app/app.service';
import { PaginatedResponse, Pantalla, Meta } from '@shared/interfaces';
import { Permiso, RolPermisos, PermisosUsuario } from '@permisos/interfaces';
import { getRolesPermisos } from '../actions/get-roles-permisos.action';
import { getPermisosDisponibles } from '../actions/get-permisos-disponibles.action';
import { crearRol, actualizarRol } from '../actions';
import { CreateRolRequest } from '../interfaces/create-rol.interface';
import { actualizarPermisosUsuario } from '../actions/actualizar-permisos-usuario.action';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private http = inject(HttpClient);
  private appService = inject(AppService);
  private queryClient = inject(QueryClient);
  private _appService = inject(AppService);
  private _estadoModal = signal({
    titulo: '',
    edicion: false,
  });
  private _modoCreacion = signal<boolean>(false);
  private _filaPermisosEditando = signal<{ [id: number]: boolean }>({});
  private _pantallaSeleccionada = signal<Pantalla | null>(null);
  private _permisosSeleccionados = signal<Record<number, Permiso[]>>({});
  private _permisosNuevoRol = signal<Permiso[]>([]);
  private _permisosUsuarioEditando = signal<Record<number, Permiso[]>>({});

  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  private _datosPaginador = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  private _modoCreacionRol = signal<boolean>(false);
  private _filaRolEditando = signal<{ [id: number]: boolean }>({});
  private _paginacionRoles = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginadorRoles = signal<Meta | null>(null);

  public modoCreacionRol = computed(() => this._modoCreacionRol());
  public filaRolEditando = computed(() => this._filaRolEditando());
  public paginacionRoles = computed(() => this._paginacionRoles());
  public datosPaginadorRoles = computed(() => this._datosPaginadorRoles());

  public pantallaSeleccionada = computed(() => this._pantallaSeleccionada());
  public filtroTexto = computed(() => this._filtroTexto());
  public permisosSeleccionados = computed(() => this._permisosSeleccionados());
  public permisosNuevoRol = computed(() => this._permisosNuevoRol());
  public permisosUsuarioEditando = computed(() =>
    this._permisosUsuarioEditando(),
  );

  private _pestana = signal<'rol'>('rol');
  public pestana = computed(() => this._pestana());

  public setPestana(value: 'rol') {
    this._pestana.set(value);
  }

  public permisosQuery = [];

  // public permisosQuery = injectQuery(() => ({
  //   queryKey: ['permisos', this.paginacionRoles(), this._filtroTexto()],
  //   queryFn: () => {
  //     const params = this.paginacionRoles();
  //     return getPermisos(this.http, { ...params, search: this._filtroTexto() });
  //   },
  //   select: (response: PaginatedResponse<PermisosUsuario>) => {
  //     this._datosPaginador.set(response.meta);
  //     return response.data;
  //   },
  // }));

  public rolesPermisosQuery = injectQuery(() => ({
    queryKey: ['roles-permisos', this.paginacionRoles()],
    queryFn: () =>
      getRolesPermisos(this.http, {
        ...this.paginacionRoles(),
      }),
    select: (response: PaginatedResponse<RolPermisos>) => {
      this._datosPaginadorRoles.set(response.meta);
      return response.data;
    },
  }));

  public setEstadoModal(titulo: string, edicion: boolean) {
    this._estadoModal.set({
      titulo,
      edicion,
    });
  }

  public setModoCreacion(value: boolean) {
    this._modoCreacion.set(value);
  }

  public setEditandoFilaPermisos(id: number, estado: boolean) {
    this._filaPermisosEditando.set({
      ...this._filaPermisosEditando(),
      [id]: estado,
    });
  }

  public setPantallaSeleccionada(pantalla: Pantalla | null) {
    this._pantallaSeleccionada.set(pantalla);
  }

  public setPaginacion(paginacion: PaginationState) {
    this._paginacion.set(paginacion);
  }

  public setFiltroTexto(filtro: string) {
    this._filtroTexto.set(filtro);
    this.setPaginacion({
      ...this._paginacion(),
      pageIndex: 0,
    });
  }

  public limpiarFiltro() {
    this._filtroTexto.set('');
  }

  public resetFilaPermisosEditando() {
    this._filaPermisosEditando.set({});
  }

  public prefetchPermisos(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['permisos', state, this._filtroTexto()],
      queryFn: () =>
        getPermisos(this.http, {
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  public prefetchRoles(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['roles-permisos', state, this._filtroTexto()],
      queryFn: () =>
        getPermisos(this.http, {
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  public setPermisosSeleccionados(rolId: number, permisos: Permiso[]) {
    this._permisosSeleccionados.update(state => ({
      ...state,
      [rolId]: [...permisos],
    }));
  }

  public getPermisosSeleccionados(rolId: number): Permiso[] {
    return this._permisosSeleccionados()[rolId] || [];
  }

  public setPermisosNuevoRol(permisos: Permiso[]) {
    this._permisosNuevoRol.set([...permisos]);
  }

  public limpiarPermisosSeleccionados(rolId: number) {
    this._permisosSeleccionados.update(state => {
      const newState = { ...state };
      delete newState[rolId];
      return newState;
    });
  }

  public resetPermisosSeleccionados() {
    this._permisosSeleccionados.set({});
    this._permisosNuevoRol.set([]);
    this._permisosUsuarioEditando.set({});
  }

  public setPermisosUsuarioEditando(userId: number, permisos: Permiso[]) {
    const userKey = -Math.abs(userId);
    this._permisosSeleccionados.update(state => ({
      ...state,
      [userKey]: [...permisos],
    }));
  }

  public getPermisosUsuarioEditando(userId: number): Permiso[] {
    const userKey = -Math.abs(userId);
    return this._permisosSeleccionados()[userKey] || [];
  }

  public limpiarPermisosUsuarioEditando(userId: number) {
    const userKey = -Math.abs(userId);
    this._permisosSeleccionados.update(state => {
      const newState = { ...state };
      delete newState[userKey];
      return newState;
    });
  }

  public async actualizarPermisosUsuarioAsync(
    userId: number,
    permisos: Permiso[],
  ): Promise<PermisosUsuario> {
    return actualizarPermisosUsuario(this.http, userId, permisos);
  }

  public async crearRolAsync(rol: CreateRolRequest): Promise<RolPermisos> {
    return crearRol(this.http, rol);
  }

  public async actualizarRolAsync(
    id: number,
    rol: CreateRolRequest,
  ): Promise<RolPermisos> {
    return actualizarRol(this.http, id, rol);
  }

  resetAllexceptPaginacion() {
    this._modoCreacionRol.set(false);
    this._filaRolEditando.set({});
    this._pantallaSeleccionada.set(null);
    this._permisosSeleccionados.set({});
    this._permisosNuevoRol.set([]);
    this._paginacionRoles.set({
      pageIndex: 0,
      pageSize: 10,
    });
    this._datosPaginadorRoles.set(null);
  }

  public setPaginacionRoles(paginacion: PaginationState) {
    this._paginacionRoles.set(paginacion);
  }

  public setModoCreacionRol(estado: boolean) {
    this._modoCreacionRol.set(estado);
  }

  public setEditandoFilaRol(id: number, estado: boolean) {
    this._filaRolEditando.set({
      ...this._filaRolEditando(),
      [id]: estado,
    });
  }

  public iniciarCrearRol() {
    this.setModoCreacionRol(true);
    this.setEditandoFilaRol(0, true);
    this.setPestana('rol');
  }
}
