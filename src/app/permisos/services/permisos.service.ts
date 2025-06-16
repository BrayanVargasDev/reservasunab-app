import { Injectable, signal, computed, inject } from '@angular/core';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';

import { PaginationState } from '@tanstack/angular-table';

import { getPermisos } from '../actions';
import { AppService } from '@app/app.service';
import { PermisosUsuario } from '@permisos/interfaces/permisos-usuario.interface';
import { PaginatedResponse, Pantalla, Meta } from '@shared/interfaces';
import { Permiso } from '@permisos/interfaces/permiso.interface';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
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
  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  private _datosPaginador = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());
  public botonArenderizar = computed(() => this._botonARenderizar());
  public estadoModal = computed(() => this._estadoModal());
  public modoCreacion = computed(() => this._modoCreacion());
  public filaPermisosEditando = computed(() => this._filaPermisosEditando());
  public pantallaSeleccionada = computed(() => this._pantallaSeleccionada());
  public filtroTexto = computed(() => this._filtroTexto());

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

  public setDatosPaginador(datos: Partial<Meta>) {
    this._datosPaginador.update(
      state =>
        ({
          ...state,
          ...datos,
        } as Meta),
    );
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
}
