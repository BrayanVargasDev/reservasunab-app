import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { PagoInfo } from '../../interfaces';
import { getPagoInfo } from '../../actions';
import { PagosService } from '../../services/pagos.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '../../components/error-display/error-display.component';
import { PagoInfoCardComponent } from '../../components/pago-info-card/pago-info-card.component';

@Component({
  selector: 'app-pago-redirect',
  templateUrl: './pago-redirect.page.html',
  styleUrls: ['./pago-redirect.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    LoadingSpinnerComponent,
    ErrorDisplayComponent,
    PagoInfoCardComponent,
  ],
})
export class PagoRedirectPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private pagosService = inject(PagosService);

  pagoInfo: PagoInfo | null = null;
  loading = true;
  error: string | null = null;
  codigo: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.codigo = params['codigo'];
      if (this.codigo) {
        this.cargarInfoPago();
      } else {
        this.error = 'Código de pago no válido';
        this.loading = false;
      }
    });
  }

  async cargarInfoPago() {
    if (!this.codigo) return;

    try {
      this.loading = true;
      this.error = null;
      this.pagoInfo = await this.pagosService.obtenerInfoPago({ codigo: this.codigo });
    } catch (error: any) {
      console.error('Error al cargar información del pago:', error);
      this.error = error.message || 'Error al cargar la información del pago';
    } finally {
      this.loading = false;
    }
  }

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

  volver() {
    this.router.navigate(['/']);
  }

  reintentar() {
    if (this.codigo) {
      this.cargarInfoPago();
    }
  }

  formatearMonto(monto: number): string {
    return this.pagosService.formatearMonto(monto);
  }

  formatearFecha(fecha: string): string {
    return this.pagosService.formatearFecha(fecha);
  }

  obtenerMensajeEstado(estado: string): string {
    return this.pagosService.obtenerMensajeEstado(estado);
  }
}
