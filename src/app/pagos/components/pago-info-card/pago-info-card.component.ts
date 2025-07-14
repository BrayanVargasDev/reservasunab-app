import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PagoInfo } from '../../interfaces';

@Component({
  selector: 'app-pago-info-card',
  template: `
    <div class="pago-info-container">
      <!-- Header con estado del pago -->
      <div class="pago-header" [ngClass]="getEstadoClass(pagoInfo.estado)">
        <div class="estado-badge">
          <ion-icon [name]="getEstadoIcon(pagoInfo.estado)" class="estado-icon"></ion-icon>
          <h1>{{ getEstadoTexto(pagoInfo.estado) }}</h1>
        </div>
      </div>

      <!-- Información principal del pago -->
      <div class="pago-main-info">
        <div class="info-card">
          <h2>Información del Pago</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Código de Pago:</label>
              <span class="codigo-pago">{{ pagoInfo.codigo }}</span>
            </div>
            <div class="info-item">
              <label>Monto:</label>
              <span class="monto">{{ formatearMonto(pagoInfo.monto) }}</span>
            </div>
            <div class="info-item">
              <label>Método de Pago:</label>
              <span>{{ pagoInfo.metodoPago }}</span>
            </div>
            <div class="info-item">
              <label>Referencia:</label>
              <span>{{ pagoInfo.referencia }}</span>
            </div>
            <div class="info-item">
              <label>Fecha de Creación:</label>
              <span>{{ formatearFecha(pagoInfo.fechaCreacion) }}</span>
            </div>
          </div>
        </div>

        <!-- Información de la transacción (si existe) -->
        <div class="info-card" *ngIf="pagoInfo.transaccion">
          <h2>Información de la Transacción</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>ID Transacción:</label>
              <span>{{ pagoInfo.transaccion.id }}</span>
            </div>
            <div class="info-item">
              <label>Número de Transacción:</label>
              <span>{{ pagoInfo.transaccion.numeroTransaccion }}</span>
            </div>
            <div class="info-item">
              <label>Fecha de Transacción:</label>
              <span>{{ formatearFecha(pagoInfo.transaccion.fecha) }}</span>
            </div>
            <div class="info-item" *ngIf="pagoInfo.transaccion.mensaje">
              <label>Mensaje:</label>
              <span>{{ pagoInfo.transaccion.mensaje }}</span>
            </div>
          </div>
        </div>

        <!-- Información de la reserva -->
        <div class="info-card">
          <h2>Información de la Reserva</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Código de Reserva:</label>
              <span>{{ pagoInfo.reserva.codigo }}</span>
            </div>
            <div class="info-item">
              <label>Servicio:</label>
              <span>{{ pagoInfo.reserva.servicio.nombre }}</span>
            </div>
            <div class="info-item" *ngIf="pagoInfo.reserva.servicio.descripcion">
              <label>Descripción:</label>
              <span>{{ pagoInfo.reserva.servicio.descripcion }}</span>
            </div>
            <div class="info-item">
              <label>Fecha:</label>
              <span>{{ pagoInfo.reserva.fecha | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <label>Hora:</label>
              <span>{{ pagoInfo.reserva.hora }}</span>
            </div>
          </div>
        </div>

        <!-- Información del usuario -->
        <div class="info-card">
          <h2>Información del Usuario</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre:</label>
              <span>{{ pagoInfo.reserva.usuario.nombre }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ pagoInfo.reserva.usuario.email }}</span>
            </div>
            <div class="info-item">
              <label>Documento:</label>
              <span>{{ pagoInfo.reserva.usuario.documento }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje adicional según el estado -->
      <div class="estado-mensaje" [ngClass]="getEstadoClass(pagoInfo.estado)">
        <div class="mensaje-estado">
          <ion-icon [name]="getEstadoIcon(pagoInfo.estado)" class="mensaje-icon"></ion-icon>
          <p>{{ obtenerMensajeEstado(pagoInfo.estado) }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./pago-info-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PagoInfoCardComponent {
  @Input() pagoInfo!: PagoInfo;
  @Input() formatearMonto!: (monto: number) => string;
  @Input() formatearFecha!: (fecha: string) => string;
  @Input() obtenerMensajeEstado!: (estado: string) => string;

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'estado-completado';
      case 'pendiente':
        return 'estado-pendiente';
      case 'procesando':
        return 'estado-procesando';
      case 'rechazado':
        return 'estado-rechazado';
      default:
        return 'estado-pendiente';
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'checkmark-circle';
      case 'pendiente':
        return 'time';
      case 'procesando':
        return 'refresh-circle';
      case 'rechazado':
        return 'close-circle';
      default:
        return 'time';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'Pago Completado';
      case 'pendiente':
        return 'Pago Pendiente';
      case 'procesando':
        return 'Procesando Pago';
      case 'rechazado':
        return 'Pago Rechazado';
      default:
        return 'Estado Desconocido';
    }
  }
}
