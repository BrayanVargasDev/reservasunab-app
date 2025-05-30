import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  arrowForwardCircleOutline,
  checkmarkCircle,
  closeCircle,
  time,
  wallet,
} from 'ionicons/icons';

interface Pago {
  id: number;
  concepto: string;
  monto: number;
  fecha: string;
  estado: string;
  metodoPago: string;
}

@Component({
  selector: 'app-pagos-main',
  templateUrl: './pagos-main.page.html',
  styleUrls: ['./pagos-main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PagosMainPage implements OnInit {
  pagos: Pago[] = [];

  constructor() {
    addIcons({
      wallet,
      closeCircle,
      time,
      arrowForwardCircleOutline,
      checkmarkCircle,
    });
  }

  ngOnInit() {
    this.cargarPagos();
  }

  cargarPagos() {
    // En una implementación real, estos datos vendrían del backend
    this.pagos = [
      {
        id: 1,
        concepto: 'Factura #12345',
        monto: 150000,
        fecha: '10/05/2025',
        estado: 'Pagado',
        metodoPago: 'Tarjeta de crédito',
      },
      {
        id: 2,
        concepto: 'Factura #12346',
        monto: 75000,
        fecha: '12/05/2025',
        estado: 'Pendiente',
        metodoPago: 'Transferencia',
      },
      {
        id: 3,
        concepto: 'Factura #12347',
        monto: 300000,
        fecha: '15/05/2025',
        estado: 'Pendiente',
        metodoPago: 'Efectivo',
      },
      {
        id: 4,
        concepto: 'Factura #12348',
        monto: 220000,
        fecha: '18/05/2025',
        estado: 'Rechazado',
        metodoPago: 'Tarjeta de crédito',
      },
      {
        id: 5,
        concepto: 'Factura #12349',
        monto: 85000,
        fecha: '20/05/2025',
        estado: 'Pendiente',
        metodoPago: 'Transferencia',
      },
    ];
  }

  formatMonto(monto: number): string {
    return monto.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Rechazado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  procesarPago(id: number) {
    console.log('Procesar pago ID:', id);
    // Implementación real: llamar al servicio que procesa el pago
  }
}
