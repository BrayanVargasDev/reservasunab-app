import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import moment from 'moment-timezone';
import 'moment/locale/es';

import { PagoInfo, GetPagoInfoParams } from '../interfaces';
import { getPagoInfo } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private http = inject(HttpClient);

  constructor() {
    moment.tz.setDefault('America/Bogota');
    moment.locale('es');
  }

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
    return moment(fecha).format('MMMM DD YYYY, h:mm a');
  }

  obtenerMensajeEstado(estado: string): string {
    const mensajes = {
      OK: 'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      completado:
        'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      pendiente:
        'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      PENDING:
        'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      procesando: 'Estamos procesando tu pago. Esto puede tomar unos minutos.',
      rechazado:
        'Tu pago ha sido rechazado. Intenta con otro método de pago o contacta soporte.',
    };

    return (
      mensajes[estado as keyof typeof mensajes] || 'Estado de pago desconocido.'
    );
  }
}
