import { Injectable, signal, computed, inject } from '@angular/core';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { PaginationState } from '@tanstack/angular-table';

import { getPermisos } from '../actions';
import { AppService } from '@app/app.service';
import { PaginatedResponse, Pantalla, Meta } from '@shared/interfaces';
import { Permiso, RolPermisos, PermisosUsuario } from '@permisos/interfaces';
import { getRolesPermisos } from '../actions/get-roles-permisos.action';
import { getPermisosDisponibles } from '../actions/get-permisos-disponibles.action';
import { crearRol, actualizarRol } from '../actions';
import { CreateRolRequest } from '../interfaces/create-rol.interface';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  private appService = inject(AppService);
  private queryClient = inject(QueryClient);
  private _appService = inject(AppService);
  private _botonARenderizar = signal<'rol' | 'permiso'>('permiso');
  private _estadoModal = signal({
    titulo: '',
    edicion: false,
  });
  private _modoCreacion = signal<boolean>(false);
  private _filaPermisosEditando = signal<{ [id: number]: boolean }>({});
  private _pantallaSeleccionada = signal<Pantalla | null>(null);

  // Nuevo signal para persistir permisos seleccionados por rol
  private _permisosSeleccionados = signal<Record<number, Permiso[]>>({});
  // Signal especial para permisos de nuevo rol (key = -1)
  private _permisosNuevoRol = signal<Permiso[]>([]);

  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  private _paginacionRoles = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  private _datosPaginador = signal<Meta | null>(null);
  private _datosPaginadorRoles = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  public paginacion = computed(() => this._paginacion());
  public paginacionRoles = computed(() => this._paginacionRoles());
  public datosPaginador = computed(() => this._datosPaginador());
  public datosPaginadorRoles = computed(() => this._datosPaginadorRoles());
  public botonArenderizar = computed(() => this._botonARenderizar());
  public estadoModal = computed(() => this._estadoModal());
  public modoCreacion = computed(() => this._modoCreacion());
  public filaPermisosEditando = computed(() => this._filaPermisosEditando());
  public pantallaSeleccionada = computed(() => this._pantallaSeleccionada());
  public filtroTexto = computed(() => this._filtroTexto());

  // Nuevos computed para permisos seleccionados
  public permisosSeleccionados = computed(() => this._permisosSeleccionados());
  public permisosNuevoRol = computed(() => this._permisosNuevoRol());

  public setBotonARenderizar(value: 'rol' | 'permiso') {
    this._botonARenderizar.set(value);
  }

  public permisosQuery = injectQuery(() => ({
    queryKey: ['permisos', this.paginacion(), this._filtroTexto()],
    queryFn: () => {
      const params = this.paginacion();
      return getPermisos(params);
    },
    select: (response: PaginatedResponse<PermisosUsuario>) => {
      this._datosPaginador.set(response.meta);
      return response.data;
    },
  }));

  public rolesPermisosQuery = injectQuery(() => ({
    queryKey: ['roles-permisos', this.paginacion(), this._filtroTexto()],
    queryFn: () => {
      const params = this.paginacion();
      return getRolesPermisos(params);
    },
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

  public setPaginacionRoles(paginacion: PaginationState) {
    this._paginacionRoles.set(paginacion);
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

  public setDatosPaginador(datos: Partial<Meta>) {
    this._datosPaginador.update(
      state =>
        ({
          ...state,
          ...datos,
        } as Meta),
    );
  }

  public resetFilaPermisosEditando() {
    this._filaPermisosEditando.set({});
  }

  public prefetchPermisos(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['permisos', state, this._filtroTexto()],
      queryFn: () =>
        getPermisos({
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
        getPermisos({
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  /**
   * Establece los permisos seleccionados para un rol específico
   * Mantiene la persistencia de selección entre cambios de pantalla
   */
  public setPermisosSeleccionados(rolId: number, permisos: Permiso[]) {
    this._permisosSeleccionados.update(state => ({
      ...state,
      [rolId]: [...permisos],
    }));
  }

  /**
   * Obtiene los permisos seleccionados para un rol específico
   */
  public getPermisosSeleccionados(rolId: number): Permiso[] {
    return this._permisosSeleccionados()[rolId] || [];
  }

  /**
   * Establece los permisos para el nuevo rol en creación
   */
  public setPermisosNuevoRol(permisos: Permiso[]) {
    this._permisosNuevoRol.set([...permisos]);
  }

  /**
   * Limpia los permisos seleccionados para un rol específico
   */
  public limpiarPermisosSeleccionados(rolId: number) {
    this._permisosSeleccionados.update(state => {
      const newState = { ...state };
      delete newState[rolId];
      return newState;
    });
  }

  /**
   * Limpia todos los permisos seleccionados
   */
  public resetPermisosSeleccionados() {
    this._permisosSeleccionados.set({});
    this._permisosNuevoRol.set([]);
  }

  /**
   * Crea un nuevo rol con sus permisos
   */
  public async crearRolAsync(rol: CreateRolRequest): Promise<RolPermisos> {
    return crearRol(rol);
  }

  /**
   * Actualiza un rol existente con sus permisos
   */
  public async actualizarRolAsync(
    id: number,
    rol: CreateRolRequest,
  ): Promise<RolPermisos> {
    return actualizarRol(id, rol);
  }
}
