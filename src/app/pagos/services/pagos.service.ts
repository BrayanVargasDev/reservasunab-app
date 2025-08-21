import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { parseISO } from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';

import { injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { PaginationState } from '@tanstack/angular-table';

import { type Meta, PaginatedResponse } from '@shared/interfaces';
import { PagoInfo, GetPagoInfoParams, Pago } from '../interfaces';
import { getPagoInfo, getPagos } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private http = inject(HttpClient);
  private queryClient = inject(QueryClient);

  // Estados para la tabla de pagos
  private _paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  private _datosPaginador = signal<Meta | null>(null);
  private _filtroTexto = signal<string>('');

  public paginacion = computed(() => this._paginacion());
  public datosPaginador = computed(() => this._datosPaginador());
  public filtroTexto = this._filtroTexto.asReadonly();

  public pagosQuery = injectQuery(() => ({
    queryKey: ['pagos', this.paginacion(), this._filtroTexto()],
    queryFn: () =>
      getPagos(this.http, {
        ...this.paginacion(),
        search: this._filtroTexto(),
      }),
    select: (response: PaginatedResponse<Pago>) => {
      this._datosPaginador.set(response.meta);
      return response.data;
    },
  }));

  constructor() {}

  // Métodos para la tabla
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

  public prefetchPagos(state: PaginationState) {
    this.queryClient.prefetchQuery({
      queryKey: ['pagos', state, this._filtroTexto()],
      queryFn: () =>
        getPagos(this.http, {
          ...state,
          search: this._filtroTexto(),
        }),
      staleTime: 1000 * 60 * 5,
    });
  }

  // Métodos existentes
  async obtenerInfoPago(params: GetPagoInfoParams) {
    return getPagoInfo(this.http, params);
  }

  formatearMonto(monto: number | string): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(typeof monto === 'number' ? monto : parseFloat(monto));
  }

  formatearFecha(fecha: string): string {
    // Mostrar siempre en zona Bogotá
    return formatInBogota(parseISO(fecha), 'MMMM dd yyyy, h:mm a');
  }

  formatearFechaCorta(fecha: string): string {
    return formatInBogota(parseISO(fecha), 'dd/MM/yyyy');
  }

  obtenerMensajeEstado(estado: string): string {
    if (!estado) return 'Estado desconocido.';

    const original = estado.trim();
    const upper = original.toUpperCase();

    // Estados de RESERVA manejados internamente
    const mensajesReserva: Record<string, string> = {
      INICIAL: 'La reserva ha sido creada correctamente.',
      PENDIENTEAP: 'La reserva está pendiente de aprobación.',
      APROBADA: 'La reserva ha sido aprobada.',
      COMPLETADA:
        'La reserva se ha completado correctamente (pagada o agendada).',
    };

    // Estados de PAGO simplificados (ecollect)
    const mensajesPago: Record<string, string> = {
      OK: 'Transacción aprobada por la entidad financiera.',
      PENDING:
        'La transacción está pendiente de confirmación por parte de la entidad financiera.',
      EXPIRED:
        'La transacción expiró antes de completarse. Inicia un nuevo proceso de pago.',
      NOT_AUTHORIZED: 'Transacción rechazada por la entidad financiera.',
      NO_AUTHORIZED: 'Transacción rechazada por la entidad financiera.', // Posible variante recibida
      ERROR:
        'Ocurrió un error procesando la transacción. Intenta nuevamente o contacta soporte.',
    };

    // Sinónimos / legacy -> estado canónico
    const equivalencias: Record<string, string> = {
      // Reserva legacy
      PAGADA: 'COMPLETADA',
      CONFIRMADA: 'COMPLETADA',
      COMPLETADO: 'COMPLETADA',
      COMPLETADA: 'COMPLETADA',
      PENDIENTE: 'PENDING', // cuando venga de flujo de pago, se interpretará más abajo
      PROCESANDO: 'PENDING',
      RECHAZADO: 'NOT_AUTHORIZED',
      RECHAZADA: 'NOT_AUTHORIZED',
      FAILED: 'ERROR',
      BANK: 'PENDING',
      CAPTURED: 'PENDING',
      CREATED: 'PENDING',
      ENROLLED: 'OK',
    };

    const canon = equivalencias[upper] || upper;

    if (mensajesReserva[canon]) return mensajesReserva[canon];
    if (mensajesPago[canon]) return mensajesPago[canon];

    return 'Estado desconocido.';
  }

  obtenerColorEstado(
    estado: string,
  ): 'success' | 'warning' | 'error' | 'primary' {
    if (!estado) return 'primary';
    const upper = estado.trim().toUpperCase();
    console.log('🚀 ✅ ~ PagosService ~ obtenerColorEstado ~ upper:', upper)

    // Normalizar con las mismas equivalencias usadas en mensajes
    const equivalencias: Record<string, string> = {
      PAGADA: 'COMPLETADA',
      CONFIRMADA: 'COMPLETADA',
      COMPLETADO: 'COMPLETADA',
      PENDIENTE: 'PENDING',
      PROCESANDO: 'PENDING',
      RECHAZADO: 'NOT_AUTHORIZED',
      RECHAZADA: 'NOT_AUTHORIZED',
      FAILED: 'ERROR',
      BANK: 'PENDING',
      CAPTURED: 'PENDING',
      CREATED: 'PENDING',
      ENROLLED: 'OK',
      NO_AUTHORIZED: 'NOT_AUTHORIZED',
    };
    const canon = equivalencias[upper] || upper;

    if (['OK', 'COMPLETADA', 'APROBADA'].includes(canon)) return 'success';

    if (['PENDING', 'INICIAL', 'PENDIENTEAP'].includes(canon)) return 'warning';

    if (['NOT_AUTHORIZED', 'ERROR', 'EXPIRED'].includes(canon)) return 'error';

    return 'primary';
  }

  obtenerMensajeEstadoBadge(estado: string): string {
    if (!estado) return 'desconocido';
    const upper = estado.trim().toUpperCase();

    const equivalencias: Record<string, string> = {
      PAGADA: 'COMPLETADA',
      CONFIRMADA: 'COMPLETADA',
      COMPLETADO: 'COMPLETADA',
      PENDIENTE: 'PENDING',
      PROCESANDO: 'PENDING',
      RECHAZADO: 'NOT_AUTHORIZED',
      RECHAZADA: 'NOT_AUTHORIZED',
      FAILED: 'ERROR',
      BANK: 'PENDING',
      CAPTURED: 'PENDING',
      CREATED: 'PENDING',
      ENROLLED: 'OK',
      NO_AUTHORIZED: 'NOT_AUTHORIZED',
    };
    const canon = equivalencias[upper] || upper;

    const badges: Record<string, string> = {
      // Reserva
      INICIAL: 'creada',
      PENDIENTEAP: 'pendiente aprobación',
      APROBADA: 'aprobada',
      COMPLETADA: 'completada',

      // Pago
      OK: 'aprobado',
      PENDING: 'pendiente',
      EXPIRED: 'expirado',
      NOT_AUTHORIZED: 'rechazado',
      ERROR: 'error',
    };

    return badges[canon] || 'desconocido';
  }
}
