import {
  Injectable,
  signal,
  computed,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';

import {
  updateEstadoCategoria,
  createCategoria,
  updateCategoria,
  getCategorias,
  updateEstadoGrupo,
  createGrupo,
  updateGrupo,
  getGrupos,
} from '../actions';
import {
  Categoria,
  Grupo,
  Meta,
  PaginatedResponse,
  GeneralResponse,
} from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  private _pestana = signal<'categorias' | 'grupos'>('categorias');
  private _alertaConfig = signal<ViewContainerRef | null>(null);

  // Categorías
  private _modoCreacionCategoria = signal<boolean>(false);
  private _filaCategoriaEditando = signal<{ [id: number]: boolean }>({});
  private _paginacionCategorias = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginadorCategorias = signal<Meta | null>(null);

  // Grupos
  private _modoCreacionGrupo = signal<boolean>(false);
  private _filaGrupoEditando = signal<{ [id: number]: boolean }>({});
  private _paginacionGrupos = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginadorGrupos = signal<Meta | null>(null);

  public pestana = computed(() => this._pestana());
  public alertaConfig = computed(() => this._alertaConfig());

  // Categorías
  public modoCreacionCategoria = computed(() => this._modoCreacionCategoria());
  public filaCategoriaEditando = computed(() => this._filaCategoriaEditando());
  public paginacionCategorias = computed(() => this._paginacionCategorias());
  public datosPaginadorCategorias = computed(() =>
    this._datosPaginadorCategorias(),
  );

  // Grupos
  public modoCreacionGrupo = computed(() => this._modoCreacionGrupo());
  public filaGrupoEditando = computed(() => this._filaGrupoEditando());
  public paginacionGrupos = computed(() => this._paginacionGrupos());
  public datosPaginadorGrupos = computed(() =>
    this._datosPaginadorGrupos(),
  );

  public categoriasQuery = injectQuery(() => ({
    queryKey: ['categorias', this.paginacionCategorias()],
    queryFn: () =>
      getCategorias(this.http, {
        ...this.paginacionCategorias(),
      }),
    select: (response: PaginatedResponse<Categoria>) => response.data,
  }));

  public gruposQuery = injectQuery(() => ({
    queryKey: ['grupos', this.paginacionGrupos()],
    queryFn: () =>
      getGrupos(this.http, {
        ...this.paginacionGrupos(),
      }),
    select: (response: PaginatedResponse<Grupo>) => response.data,
  }));

  // Métodos para Categorías
  public setPaginacionCategorias(paginacion: PaginationState) {
    this._paginacionCategorias.set(paginacion);
  }

  public cambiarEstadoCategoria(id: number, estado: string) {
    return updateEstadoCategoria(this.http, id, estado);
  }

  public setModoCreacionCategoria(estado: boolean) {
    this._modoCreacionCategoria.set(estado);
  }

  public setEditandoFilaCategoria(id: number, estado: boolean) {
    this._filaCategoriaEditando.set({
      ...this._filaCategoriaEditando(),
      [id]: estado,
    });
  }

  public async crearCategoria(categoria: Partial<Categoria>) {
    return createCategoria(this.http, categoria);
  }

  public async actualizarCategoria(id: number, categoria: Categoria) {
    return updateCategoria(this.http, categoria, id);
  }

  public inciarCrearCategoria() {
    this.setModoCreacionCategoria(true);
    this.setEditandoFilaCategoria(0, true);
    this.setPestana('categorias');
  }

  public prefetchCategorias(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['categorias', state],
      queryFn: () =>
        getCategorias(this.http, {
          ...state,
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  // Métodos para Grupos
  public setPaginacionGrupos(paginacion: PaginationState) {
    this._paginacionGrupos.set(paginacion);
  }

  public cambiarEstadoGrupo(id: number, estado: string) {
    return updateEstadoGrupo(this.http, id, estado);
  }

  public setModoCreacionGrupo(estado: boolean) {
    this._modoCreacionGrupo.set(estado);
  }

  public setEditandoFilaGrupo(id: number, estado: boolean) {
    this._filaGrupoEditando.set({
      ...this._filaGrupoEditando(),
      [id]: estado,
    });
  }

  public async crearGrupo(grupo: Partial<Grupo>) {
    return createGrupo(this.http, grupo);
  }

  public async actualizarGrupo(id: number, grupo: Grupo) {
    return updateGrupo(this.http, grupo, id);
  }

  public inciarCrearGrupo() {
    this.setModoCreacionGrupo(true);
    this.setEditandoFilaGrupo(0, true);
    this.setPestana('grupos');
  }

  public prefetchGrupos(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['grupos', state],
      queryFn: () =>
        getGrupos(this.http, {
          ...state,
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  // Métodos generales
  public setPestana(pestana: 'categorias' | 'grupos') {
    this._pestana.set(pestana);
  }

  public setAlertaConfig(alertaConfig: ViewContainerRef | null) {
    this._alertaConfig.set(alertaConfig);
  }

  public resetAll() {
    // Reset categorías
    this._modoCreacionCategoria.set(false);
    this._filaCategoriaEditando.set({});
    this._paginacionCategorias.set({
      pageIndex: 0,
      pageSize: 10,
    });
    this._datosPaginadorCategorias.set(null);

    // Reset grupos
    this._modoCreacionGrupo.set(false);
    this._filaGrupoEditando.set({});
    this._paginacionGrupos.set({
      pageIndex: 0,
      pageSize: 10,
    });
    this._datosPaginadorGrupos.set(null);
  }
}
