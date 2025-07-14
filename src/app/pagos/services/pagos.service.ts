import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagoInfo, GetPagoInfoParams } from '../interfaces';
import { getPagoInfo } from '../actions';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private http = inject(HttpClient);

  async obtenerInfoPago(params: GetPagoInfoParams): Promise<PagoInfo> {
    return getPagoInfo(this.http, params);
  }

  formatearMonto(monto: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  }

  formatearFecha(fecha: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(fecha));
  }

  obtenerMensajeEstado(estado: string): string {
    const mensajes = {
      'completado': 'Tu pago ha sido procesado exitosamente. Recibirás un correo de confirmación.',
      'pendiente': 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      'procesando': 'Estamos procesando tu pago. Esto puede tomar unos minutos.',
      'rechazado': 'Tu pago ha sido rechazado. Intenta con otro método de pago o contacta soporte.'
    };

    return mensajes[estado as keyof typeof mensajes] || 'Estado de pago desconocido.';
  }
}
