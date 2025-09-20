import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AuthService } from '@app/auth/services/auth.service';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';
import { AlertasService } from '@shared/services/alertas.service';
import { ChartReservasMesComponent } from '@dashboard/components/chart-reservas-mes/chart-reservas-mes.component';
import { ChartPromedioHorasComponent } from '@dashboard/components/chart-promedio-horas/chart-promedio-horas.component';
import { ChartReservasCategoriaComponent } from '@dashboard/components/chart-reservas-categoria/chart-reservas-categoria.component';
import { ChartRecaudoMensualComponent } from '@dashboard/components/chart-recaudo-mensual/chart-recaudo-mensual.component';
import { DashboardService } from '@dashboard/services/dashboard.service';
import {
  descargarReservasExcel,
  descargarPagosExcel,
} from '@dashboard/actions';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.page.html',
  styleUrls: ['./dashboard-main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    WebIconComponent,
    ChartReservasMesComponent,
    ChartPromedioHorasComponent,
    ChartReservasCategoriaComponent,
    ChartRecaudoMensualComponent,
    ReactiveFormsModule,
  ],
  host: {
    class: 'flex flex-col w-full h-full sm:pl-3 relative overflow-y-auto pb-2',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMainPage implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private alertasService = inject(AlertasService);

  // FormControl compartido para ambos selects de años
  public anioSeleccionadoControl = new FormControl<number>(0);

  // Señales para loading
  public descargandoReservas = signal(false);
  public descargandoPagos = signal(false);
  public selectsDisabled = signal(false);

  // Referencias para alertas
  @ViewChild('alertaDashboard', { read: ViewContainerRef, static: true })
  public alertaDashboard!: ViewContainerRef;

  public reservasPorMesQuery = this.dashboardService.reservasPorMesQuery;
  public promedioPorHorasQuery = this.dashboardService.promedioPorHorasQuery;
  public reservasPorCategoriaQuery =
    this.dashboardService.reservasPorCategoriaQuery;
  public recaudoMensualQuery = this.dashboardService.recaudoMensualQuery;
  public indicadores = computed(() =>
    this.dashboardService.indicadoresQuery.data(),
  );
  public usuario = computed(() => this.authService.usuario());
  public aniosConReservas = computed(() =>
    this.dashboardService.aniosConReservasQuery.data(),
  );

  ngOnInit() {
    // Inicializar select con el año actual
    const anioActual = this.dashboardService.anioSeleccionado();
    this.anioSeleccionadoControl.setValue(anioActual);

    // Suscribirse a cambios en el select
    this.anioSeleccionadoControl.valueChanges.subscribe(anio => {
      if (anio) {
        this.dashboardService.setAnioSeleccionado(anio);
      }
    });
  }

  // Método para manejar click en botón de descargar reservas
  async descargarReservas() {
    if (!this.alertaDashboard) return;

    const resultado = await this.alertasService.confirmacionConMes({
      tipo: 'question',
      titulo: 'Descargar Reporte de Reservas',
      mensaje:
        'Selecciona el mes para descargar el reporte de reservas en Excel.',
      referencia: this.alertaDashboard,
      botones: [
        { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Descargar', tipo: 'confirmar', estilo: 'btn-secondary' },
      ],
    });

    if (resultado.confirmado) {
      await this.procesarDescargaReservas(resultado.mes);
    }
  }

  // Método para manejar click en botón de descargar pagos
  async descargarPagos() {
    if (!this.alertaDashboard) return;

    const resultado = await this.alertasService.confirmacionConMes({
      tipo: 'question',
      titulo: 'Descargar Reporte de Pagos',
      mensaje: 'Selecciona el mes para descargar el reporte de pagos en Excel.',
      referencia: this.alertaDashboard,
      botones: [
        { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Descargar', tipo: 'confirmar', estilo: 'btn-secondary' },
      ],
    });

    if (resultado.confirmado) {
      await this.procesarDescargaPagos(resultado.mes);
    }
  }

  // Procesar descarga de reservas
  private async procesarDescargaReservas(mes: number) {
    try {
      this.descargandoReservas.set(true);
      this.selectsDisabled.set(true);

      const anio =
        this.anioSeleccionadoControl.value ||
        this.dashboardService.anioSeleccionado();
      const blob = await descargarReservasExcel(
        this.dashboardService['http'],
        mes,
        anio,
      );

      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservas-${anio}-${mes.toString().padStart(2, '0')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (this.alertaDashboard) {
        this.alertasService.success(
          'Reporte de reservas descargado exitosamente.',
          3000,
          this.alertaDashboard,
        );
      }
    } catch (error) {
      console.error('Error al descargar reservas:', error);
      if (this.alertaDashboard) {
        this.alertasService.error(
          'Error al descargar el reporte de reservas. Por favor, inténtalo de nuevo.',
          5000,
          this.alertaDashboard,
        );
      }
    } finally {
      this.descargandoReservas.set(false);
      this.selectsDisabled.set(false);
    }
  }

  // Procesar descarga de pagos
  private async procesarDescargaPagos(mes: number) {
    try {
      this.descargandoPagos.set(true);
      this.selectsDisabled.set(true);

      const anio =
        this.anioSeleccionadoControl.value ||
        this.dashboardService.anioSeleccionado();
      const blob = await descargarPagosExcel(
        this.dashboardService['http'],
        mes,
        anio,
      );

      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagos-${anio}-${mes.toString().padStart(2, '0')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      if (this.alertaDashboard) {
        this.alertasService.success(
          'Reporte de pagos descargado exitosamente.',
          3000,
          this.alertaDashboard,
        );
      }
    } catch (error) {
      console.error('Error al descargar pagos:', error);
      if (this.alertaDashboard) {
        this.alertasService.error(
          'Error al descargar el reporte de pagos. Por favor, inténtalo de nuevo.',
          5000,
          this.alertaDashboard,
        );
      }
    } finally {
      this.descargandoPagos.set(false);
      this.selectsDisabled.set(false);
    }
  }
}
