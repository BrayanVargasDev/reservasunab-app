import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';

import { PaginatedResponse, Meta, GeneralResponse } from '@shared/interfaces';
import { Reserva } from '../interfaces';
import { getReservas, aprobarReserva, eliminarReserva } from '../actions';

@Injectable({ providedIn: 'root' })
export class ReservasAdminService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  private _paginacion = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  private _datosPaginador = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());
  public filtroTexto = this._filtroTexto.asReadonly();

  public reservasQuery = injectQuery(() => ({
    queryKey: ['reservas', this.paginacion(), this._filtroTexto()],
    queryFn: () =>
      getReservas(this.http, {
        ...this.paginacion(),
        search: this._filtroTexto(),
      }),
    select: (response: PaginatedResponse<Reserva>) => {
      this._datosPaginador.set(response.meta);
      return response.data;
    },
  }));

  public setPaginacion(paginacion: PaginationState) {
    this._paginacion.set(paginacion);
  }

  public setFiltroTexto(filtro: string) {
    this._filtroTexto.set(filtro);
    this.setPaginacion({ ...this._paginacion(), pageIndex: 0 });
  }

  public limpiarFiltro() {
    this._filtroTexto.set('');
  }

  public async aprobar(idReserva: number) {
    return aprobarReserva(this.http, idReserva);
  }

  public async eliminar(idReserva: number) {
    return eliminarReserva(this.http, idReserva);
  }

  public prefetchReservas(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['reservas', state, this._filtroTexto()],
      queryFn: () =>
        getReservas(this.http, {
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }
}
