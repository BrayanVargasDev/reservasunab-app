import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  ViewContainerRef,
  ViewChild,
  effect,
  Injector,
} from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AuthService } from '@app/auth/services/auth.service';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';
import { AlertasService } from '@shared/services/alertas.service';
import { FileDownloadService } from '@shared/services/file-download.service';
import { ChartReservasMesComponent } from '@dashboard/components/chart-reservas-mes/chart-reservas-mes.component';
import { ChartPromedioHorasComponent } from '@dashboard/components/chart-promedio-horas/chart-promedio-horas.component';
import { ChartReservasCategoriaComponent } from '@dashboard/components/chart-reservas-categoria/chart-reservas-categoria.component';
import { ChartRecaudoMensualComponent } from '@dashboard/components/chart-recaudo-mensual/chart-recaudo-mensual.component';
import { DashboardService } from '@dashboard/services/dashboard.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
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
  private globalLoader = inject(GlobalLoaderService);
  public dashboardService = inject(DashboardService);
  private alertasService = inject(AlertasService);
  private injector = inject(Injector);
  private fileDownloadService = inject(FileDownloadService);

  // FormControls separados para los años de cada gráfica
  public anioReservasPorMesControl = new FormControl<number>(0);
  public anioRecaudoMensualControl = new FormControl<number>(0);
  // FormControls separados para los meses de cada gráfica
  public mesPromedioHorasControl = new FormControl<number>(0);
  public mesReservasCategoriaControl = new FormControl<number>(0);

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
    this.globalLoader.hide();
    // Inicializar selects con los años actuales
    const anioReservasPorMesActual = this.dashboardService.anioReservasPorMes();
    this.anioReservasPorMesControl.setValue(anioReservasPorMesActual);

    const anioRecaudoMensualActual = this.dashboardService.anioRecaudoMensual();
    this.anioRecaudoMensualControl.setValue(anioRecaudoMensualActual);

    // Inicializar selects con el mes actual
    const mesPromedioHorasActual = this.dashboardService.mesPromedioHoras();
    this.mesPromedioHorasControl.setValue(mesPromedioHorasActual);

    const mesReservasCategoriaActual =
      this.dashboardService.mesReservasCategoria();
    this.mesReservasCategoriaControl.setValue(mesReservasCategoriaActual);

    // Suscribirse a cambios en los selects de año
    this.anioReservasPorMesControl.valueChanges.subscribe(anio => {
      if (anio) {
        this.dashboardService.setAnioReservasPorMes(anio);
      }
    });

    this.anioRecaudoMensualControl.valueChanges.subscribe(anio => {
      if (anio) {
        this.dashboardService.setAnioRecaudoMensual(anio);
      }
    });

    // Suscribirse a cambios en los selects de mes
    this.mesPromedioHorasControl.valueChanges.subscribe(mes => {
      if (mes) {
        this.dashboardService.setMesPromedioHoras(mes);
      }
    });

    this.mesReservasCategoriaControl.valueChanges.subscribe(mes => {
      if (mes) {
        this.dashboardService.setMesReservasCategoria(mes);
      }
    });

    // Effect para deshabilitar controles cuando selectsDisabled cambie
    effect(
      () => {
        const disabled = this.selectsDisabled();
        if (disabled) {
          this.anioReservasPorMesControl.disable();
          this.anioRecaudoMensualControl.disable();
          this.mesPromedioHorasControl.disable();
          this.mesReservasCategoriaControl.disable();
        } else {
          this.anioReservasPorMesControl.enable();
          this.anioRecaudoMensualControl.enable();
          this.mesPromedioHorasControl.enable();
          this.mesReservasCategoriaControl.enable();
        }
      },
      {
        injector: this.injector,
      },
    );
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
        this.anioReservasPorMesControl.value ||
        this.dashboardService.anioReservasPorMes();
      const blob = await descargarReservasExcel(
        this.dashboardService['http'],
        mes,
        anio,
      );

      // Usar el servicio de descarga multiplataforma
      const filename = `reservas-${anio}-${mes
        .toString()
        .padStart(2, '0')}.xlsx`;
      await this.fileDownloadService.downloadFile({
        filename,
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        data: blob,
      });

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
        this.anioRecaudoMensualControl.value ||
        this.dashboardService.anioRecaudoMensual();
      const blob = await descargarPagosExcel(
        this.dashboardService['http'],
        mes,
        anio,
      );

      // Usar el servicio de descarga multiplataforma
      const filename = `pagos-${anio}-${mes.toString().padStart(2, '0')}.xlsx`;
      await this.fileDownloadService.downloadFile({
        filename,
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        data: blob,
      });

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

  getNombreMes(mes: number): string {
    const nombresMeses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return nombresMeses[mes - 1] || '';
  }
}
