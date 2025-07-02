import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';

import { type Meta, PaginatedResponse } from '@shared/interfaces';
import {
  getEspacios,
  createEspacio,
  updateEspacioEstado,
} from '@espacios/actions';
import { Espacio, FormEspacio } from '@espacios/interfaces';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';

@Injectable({
  providedIn: 'root',
})
export class EspaciosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);
  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginador = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());
  public filtroTexto = this._filtroTexto.asReadonly();

  public espaciosQuery = injectQuery(() => ({
    queryKey: ['espacios', this.paginacion(), this._filtroTexto()],
    queryFn: () =>
      getEspacios(this.http, {
        ...this.paginacion(),
        search: this._filtroTexto(),
      }),
    select: (response: PaginatedResponse<Espacio>) => {
      this._datosPaginador.set(response.meta);
      return response.data;
    },
  }));

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

  private _espacioAEditar = signal<Espacio | null>(null);
  public espacioAEditar = this._espacioAEditar.asReadonly();
  private _i18nDatePicker = signal(i18nDatePicker);
  public i18nDatePicker = this._i18nDatePicker.asReadonly();

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
    this._espacioAEditar.set(null);
  }

  public setModoEdicion(modo: boolean) {
    this._modoEdicion.set(modo);
  }

  public colorModal = computed(() => {
    return this._modoEdicion() ? 'secondary' : 'primary';
  });

  public tituloModal = computed(() => {
    return this._modoEdicion() ? 'Editar Espacio' : 'Nuevo Espacio';
  });

  public setEspacioAEditar(espacio: Espacio | null) {
    this._espacioAEditar.set(espacio);
  }

  public guardarEsapacio(espacio: FormEspacio) {
    return createEspacio(this.http, espacio);
  }

  public async cambiarEstadoEspacio(
    espacioId: number,
    nuevoEstado: string,
  ): Promise<Espacio> {
    return updateEspacioEstado(this.http, espacioId, nuevoEstado);
  }

  public prefetchEspacios(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['espacios', state, this._filtroTexto()],
      queryFn: () =>
        getEspacios(this.http, {
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }
}
