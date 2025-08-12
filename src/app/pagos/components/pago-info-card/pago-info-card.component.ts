import { Component, Input, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PagoInfo } from '../../interfaces';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { PagoInfoItemComponent } from './pago-info-item/pago-info-item.component';

@Component({
  selector: 'app-pago-info-card',
  templateUrl: './pago-info-card.component.html',
  styleUrls: ['./pago-info-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, WebIconComponent, PagoInfoItemComponent],
})
export class PagoInfoCardComponent {
  pagoInfo = input.required<PagoInfo>();
  formatearMonto = input.required<(monto: number | string) => string>();
  formatearFecha = input.required<(fecha: string) => string>();
  obtenerMensajeEstado = input.required<(estado: string) => string>();

  informacionTransaccionItems = computed(() => {
    if (!this.pagoInfo().transaccion) return [];

    return [
      {
        label: 'Código',
        value: this.pagoInfo().pago.codigo,
        class:
          'bg-accent uppercase w-fit border-accent font-semibold px-2 py-1 border text-accent-content rounded-xl',
      },
      {
        label: 'valor',
        value: this.formatearMonto()(this.pagoInfo().pago.valor),
        class: 'bg-success text-lg w-fit font-semibold px-2 py-1 rounded-xl',
      },
      {
        label: 'fecha de actualización',
        value: this.formatearFecha()(this.pagoInfo().pago.actualizado_en),
        class: 'font-semibold',
      },
      {
        label: 'Id de transacción',
        value: this.pagoInfo().pago.ticket_id,
        class:
          'bg-primary uppercase w-fit border-primary font-semibold px-2 py-1 border text-primary-content rounded-xl',
      },
      {
        label: 'Código trazabilidad',
        value: this.pagoInfo().transaccion.codigo_traza,
      },
      {
        label: 'Método de Pago',
        value: this.pagoInfo().transaccion.tipo,
        class: 'font-semibold',
      },
      {
        label: 'Por medio de',
        value: this.pagoInfo().transaccion.entidad,
        class: 'font-semibold',
      },
      {
        label: 'Fecha de transacción',
        value: this.formatearFecha()(this.pagoInfo().transaccion.fecha_banco),
      },
      {
        label: 'Estado de transacción',
        value: this.obtenerMensajeEstado()(this.pagoInfo().pago.estado),
        class: `estado-${this.pagoInfo().pago.estado}`,
      },
    ];
  });

  infoUsuarioItems = computed(() => {
    if (!this.pagoInfo().reserva.usuario) return [];

    return [
      {
        label: 'Nombre',
        value: this.pagoInfo().reserva.usuario.nombre_completo,
      },
      {
        label: 'Correo electrónico',
        value: this.pagoInfo().reserva.usuario.email,
      },
      {
        label: 'Documento',
        value: `${this.pagoInfo().reserva.usuario.tipo_docuemnto}`,
        class: 'font-semibold',
      },
      {
        label: 'Teléfono',
        value: this.pagoInfo().reserva.usuario.celular || 'No proporcionado',
      },
    ];
  });

  infoReservaItems = computed(() => {
    if (!this.pagoInfo().reserva) return [];

    return [
      {
        label: 'Código de reserva',
        value: this.pagoInfo().reserva.codigo,
        class:
          'bg-warning uppercase w-fit border-warning font-semibold px-2 py-1 border text-warning-content rounded-xl',
      },
      {
        label: 'Fecha',
        value: this.formatearFecha()(this.pagoInfo().reserva.fecha),
      },
      {
        label: 'Hora',
        value: `${this.formatearFecha()(
          this.pagoInfo().reserva.hora_inicio,
        )} - ${this.formatearFecha()(this.pagoInfo().reserva.hora_fin)}`,
      },
      {
        label: 'Espacio reservado',
        value: this.pagoInfo().reserva.espacio.nombre,
      },
    ];
  });

  getEstadoClass(estado: string): string {
    const completado =
      'bg-success text-success-content font-bold w-full rounded-xl shadow-lg';
    const pendiente =
      'bg-warning text-warning-content font-bold w-full rounded-xl shadow-lg';
    const procesando =
      'bg-info text-info-content font-bold w-full rounded-xl shadow-lg';
    const rechazado =
      'bg-error text-error-content font-bold w-full rounded-xl shadow-lg';

    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      // Estados exitosos
      case 'OK':
      case 'PAGADA':
      case 'CONFIRMADA':
      case 'COMPLETADO':
      case 'ENROLLED':
        return completado;

      // Estados de procesamiento/pendientes
      case 'PENDING':
      case 'BANK':
      case 'CAPTURED':
      case 'CREATED':
      case 'INICIAL':
      case 'PENDIENTE':
      case 'PROCESANDO':
        return pendiente;

      // Estados de error/rechazo
      case 'NOT_AUTHORIZED':
      case 'FAILED':
      case 'EXPIRED':
      case 'RECHAZADO':
      case 'RECHAZADA':
      case 'ERROR':
        return rechazado;

      default:
        return pendiente;
    }
  }

  getEstadoIcon(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      // Estados exitosos
      case 'OK':
      case 'PAGADA':
      case 'CONFIRMADA':
      case 'COMPLETADO':
      case 'ENROLLED':
        return 'checkmark-circle-outline';

      // Estados de procesamiento/pendientes
      case 'PENDING':
      case 'BANK':
      case 'CAPTURED':
      case 'CREATED':
      case 'INICIAL':
      case 'PENDIENTE':
      case 'PROCESANDO':
        return 'time-outline';

      // Estados de error/rechazo
      case 'NOT_AUTHORIZED':
      case 'FAILED':
      case 'EXPIRED':
      case 'RECHAZADO':
      case 'RECHAZADA':
      case 'ERROR':
        return 'close-circle-outline';

      default:
        return 'time-outline';
    }
  }

  getEstadoTexto(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      // Estados exitosos
      case 'OK':
      case 'PAGADA':
      case 'CONFIRMADA':
      case 'COMPLETADO':
      case 'ENROLLED':
        return 'Pago Completado';

      // Estados de procesamiento/pendientes
      case 'PENDING':
      case 'BANK':
      case 'CAPTURED':
      case 'CREATED':
      case 'INICIAL':
      case 'PENDIENTE':
      case 'PROCESANDO':
        return 'Pago Pendiente';

      // Estados de error/rechazo
      case 'NOT_AUTHORIZED':
      case 'FAILED':
      case 'EXPIRED':
      case 'RECHAZADO':
      case 'RECHAZADA':
      case 'ERROR':
        return 'Pago Rechazado';

      default:
        return 'Estado Desconocido';
    }
  }
}
