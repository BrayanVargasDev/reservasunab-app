import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { PagoInfo } from '@pagos/interfaces';
import { getPagoInfo } from '@pagos/actions';
import { PagosService } from '@pagos/services/pagos.service';
import { LoadingSpinnerComponent } from '@pagos/components/loading-spinner/loading-spinner.component';
import { ErrorDisplayComponent } from '@pagos/components/error-display/error-display.component';
import { PagoInfoCardComponent } from '@pagos/components/pago-info-card/pago-info-card.component';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';

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
    WebIconComponent,
  ],
})
export class PagoRedirectPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private pagosService = inject(PagosService);

  private _pagoInfo = signal<PagoInfo | null>(null);
  private _loading = signal(true);
  private _error = signal<string | null>(null);
  private _codigo = signal<string | null>(null);

  pagoInfo = computed(() => this._pagoInfo());
  loading = computed(() => this._loading());
  error = computed(() => this._error());
  codigo = computed(() => this._codigo());

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this._codigo.set(params['codigo']);
      if (this._codigo()) {
        this.cargarInfoPago();
      } else {
        this._error.set('Código de pago no válido');
        this._loading.set(false);
      }
    });
  }

  async cargarInfoPago() {
    if (!this.codigo()) return;

    try {
      this._loading.set(true);
      this._error.set(null);

      const { data: info } = await this.pagosService.obtenerInfoPago({
        codigo: this._codigo()!,
      });

      if (!info) {
        throw new Error('No se encontró información del pago');
      }

      this._pagoInfo.set(info);
    } catch (error: any) {
      console.error('Error al cargar información del pago:', error);
      this._error.set(
        error.message || 'Error al cargar la información del pago',
      );
    } finally {
      this._loading.set(false);
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
    if (this.codigo()) {
      this.cargarInfoPago();
    }
  }

  formatearMonto(monto: number | string): string {
    console.log('🚀 ✅ ~ PagoRedirectPage ~ formatearMonto ~ monto:', monto);
    return this.pagosService.formatearMonto(monto);
  }

  formatearFecha(fecha: string): string {
    return this.pagosService.formatearFecha(fecha);
  }

  obtenerMensajeEstado(estado: string): string {
    return this.pagosService.obtenerMensajeEstado(estado);
  }
}
