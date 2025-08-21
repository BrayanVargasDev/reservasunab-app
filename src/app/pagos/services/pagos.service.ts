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
    const mensajes = {
      // Estados de ecollect
      OK: 'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      NOT_AUTHORIZED:
        'Tu pago ha sido rechazado por la entidad financiera. Intenta con otro método de pago o contacta soporte.',
      BANK: 'Tu pago está siendo procesado por la entidad financiera. Te notificaremos cuando se complete.',
      PENDING:
        'Tu pago está pendiente de confirmación por parte de la entidad financiera.',
      CAPTURED:
        'Se ha generado tu transacción para pago en canales presenciales. Completa el pago en el canal indicado.',
      CREATED:
        'Tu transacción ha sido creada exitosamente. Procede a completar el pago.',
      EXPIRED: 'Tu transacción ha expirado. Inicia un nuevo proceso de pago.',
      FAILED:
        'Se presentó una falla técnica procesando tu pago. Intenta nuevamente o contacta soporte.',
      ENROLLED: 'Tu suscripción de pago recurrente ha sido exitosa.',

      // Estados internos del sistema
      inicial: 'Tu transacción ha sido iniciada. Procede a completar el pago.',
      pendiente:
        'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      pendienteap:
        'Tu reserva está pendiente de aprobación. Te notificaremos cuando se apruebe.',
      pagada:
        'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      confirmada: 'Tu pago ha sido confirmado y procesado completamente.',

      // Estados legacy (mantener compatibilidad)
      completado:
        'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      procesando: 'Estamos procesando tu pago. Esto puede tomar unos minutos.',
      rechazado:
        'Tu pago ha sido rechazado. Intenta con otro método de pago o contacta soporte.',
    };

    return (
      mensajes[estado as keyof typeof mensajes] || 'Estado de pago desconocido.'
    );
  }

  obtenerColorEstado(
    estado: string,
  ): 'success' | 'warning' | 'error' | 'primary' {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      // Estados exitosos
      case 'OK':
      case 'PAGADA':
      case 'CONFIRMADA':
      case 'COMPLETADO':
      case 'ENROLLED':
        return 'success';

      // Estados de procesamiento/pendientes
      case 'PENDING':
      case 'BANK':
      case 'CAPTURED':
      case 'CREATED':
      case 'INICIAL':
      case 'PENDIENTE APROBACIÓN':
      case 'PENDIENTE':
      case 'PROCESANDO':
        return 'warning';

      // Estados de error/rechazo
      case 'NOT_AUTHORIZED':
      case 'FAILED':
      case 'EXPIRED':
      case 'RECHAZADO':
      case 'RECHAZADA':
      case 'ERROR':
        return 'error';

      default:
        return 'primary';
    }
  }

  obtenerMensajeEstadoBadge(estado: string): string {
    const mensajes = {
      success: 'exitoso',
      warning: 'en proceso',
      error: 'en error',
      primary: 'desconocido',
    };

    return mensajes[this.obtenerColorEstado(estado)] || mensajes.primary;
  }
}
