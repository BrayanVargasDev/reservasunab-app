import {
  Component,
  inject,
  Injector,
  effect,
  viewChild,
  ElementRef,
  ViewContainerRef,
  computed,
} from '@angular/core';
import { DreservasService } from '@reservas/services/dreservas.service';
import { CommonModule } from '@angular/common';

import moment from 'moment';
import 'moment/locale/es';

import { environment } from '@environments/environment';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Configuracion } from '@espacios/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { UpperFirstPipe } from '@shared/pipes';
import { AlertasService } from '@shared/services/alertas.service';

import {
  Disponibilidad,
  ReservaEspaciosDetalles,
} from '@reservas/interfaces/reserva-espacio-detalle.interface';
import { InfoReservaComponent } from '../info-reserva/info-reserva.component';
import { TipoUsuarioConfig } from '@espacios/interfaces/tipo-usuario-config.interface';

@Component({
  selector: 'modal-dreservas',
  imports: [
    CommonModule,
    WebIconComponent,
    UpperFirstPipe,
    InfoReservaComponent,
  ],
  templateUrl: './modal-dreservas.component.html',
  styleUrl: './modal-dreservas.component.scss',
})
export class ModalDreservasComponent {
  private injector = inject(Injector);
  private environment = environment;
  private authService = inject(AuthService);
  private alertaService = inject(AlertasService);
  public dreservasService = inject(DreservasService);

  constructor() {
    // Configurar moment para usar español por defecto
    moment.locale('es');
  }
  public dreservasModal =
    viewChild<ElementRef<HTMLDialogElement>>('dreservasModal');

  public alertaModalReservas = viewChild.required('alertaModalReservas', {
    read: ViewContainerRef,
  });

  public cargando = computed(() => {
    return this.dreservasService.cargando();
  });

  public resumen = computed(() => {
    return this.dreservasService.resumen();
  });

  public miReserva = computed(() => {
    return this.dreservasService.miReserva();
  });

  public mensajeCargando = computed(() => {
    return this.dreservasService.resumen()
      ? 'Trabajando en el pago...'
      : 'Trabajando en la reserva...';
  });

  public estadoResumen = computed(() => {
    const estado = this.dreservasService.estadoResumen();
    if (estado && estado.fecha) {
      return {
        ...estado,
        fecha: moment(estado.fecha + ' 12:00', 'YYYY-MM-DD HH:mm').format(
          'dddd, D [de] MMMM [de] YYYY',
        ),
      };
    }
    return estado;
  });

  public pago = computed(() => {
    return this.dreservasService.pago();
  });

  public necesitaPago = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    console.log(
      '🚀 ✅ ~ ModalDreservasComponent ~ necesitaPago=computed ~ estado:',
      estado,
    );
    return (
      estado && estado.estado !== 'pagada' && estado.valor && estado.valor > 0
    );
  });

  ngOnInit() {
    effect(
      () => {
        const modal = this.dreservasModal()?.nativeElement;
        if (!modal) return;
        if (this.dreservasService.modalAbierta()) this.abrirModal(modal);
        else this.cerrarModal(modal);
      },
      { injector: this.injector },
    );
  }

  private abrirModal(modal: HTMLDialogElement) {
    modal.showModal();
  }

  private cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.dreservasService.cerrarModal();
  }

  public get espacioDetallesQuery() {
    return this.dreservasService.espacioDetallesQuery.data();
  }

  public getImagenUrl(ubicacion: string | undefined): string {
    if (!ubicacion) return '';
    return `${environment.apiUrl}${ubicacion}`;
  }

  public obtenerFechaDeApertura(
    configuracion: Configuracion,
    tipo_usuario_config: TipoUsuarioConfig[],
  ): string {
    try {
      if (!configuracion) return 'No disponible';

      const fechaFiltro = this.dreservasService.fecha();

      const fechaBase = fechaFiltro
        ? moment(fechaFiltro, 'YYYY-MM-DD')
        : moment();

      const fechaApertura = fechaBase
        .clone()
        .subtract(configuracion.dias_previos_apertura, 'days');

      const [horas, minutos] = configuracion.hora_apertura
        .split(':')
        .map(n => parseInt(n, 10));

      const tipoUsuarioConfig = tipo_usuario_config.find(
        config =>
          config.tipo_usuario === this.authService.usuario()?.tipo_usuario,
      );

      const minutosTotales = tipoUsuarioConfig
        ? minutos + tipoUsuarioConfig.retraso_reserva
        : minutos;

      fechaApertura.set({
        hour: horas,
        minute: minutosTotales,
        second: 0,
        millisecond: 0,
      });

      return fechaApertura.format('DD/MM/YYYY HH:mm a');
    } catch (error) {
      console.error('Error al calcular fecha de apertura:', error);
      return 'No disponible';
    }
  }

  public async iniciarReserva(
    base: ReservaEspaciosDetalles | undefined,
    item: Disponibilidad,
  ) {
    if (!base) return;
    this.dreservasService.setCargando(true);

    const fechaFiltro = this.dreservasService.fecha();
    const fechaBase = fechaFiltro
      ? moment(fechaFiltro, 'YYYY-MM-DD').format('YYYY-MM-DD')
      : moment().format('YYYY-MM-DD');

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.dreservasService
      .iniciarReserva(base, fechaBase, item.hora_inicio, item.hora_fin)
      .then(response => {
        if (!response.data) {
          this.alertaService.error(
            `Error al iniciar la reserva. Por favor, inténtelo de nuevo.`,
            5 * 1000,
            this.alertaModalReservas(),
            'flex justify-center transition-all ease-in-out w-full text-lg',
          );
          this.dreservasService.setCargando(false);
          return;
        }

        this.dreservasService.setEstadoResumen(response.data);
        this.dreservasService.setResumen(true);
        this.dreservasService.setCargando(false);
      })
      .catch(error => {
        const mensajeError =
          error.error?.error ||
          'Error al iniciar la reserva. Por favor, inténtelo de nuevo.';

        this.alertaService.error(
          mensajeError,
          5 * 1000,
          this.alertaModalReservas(),
          'flex justify-center transition-all ease-in-out w-full text-lg',
        );
        this.dreservasService.setCargando(false);
      });
  }

  public procesarPago() {
    this.dreservasService.setCargando(true);
    this.dreservasService.setPago(true);

    const estadoResumen = this.estadoResumen() ?? this.miReserva();

    if (!estadoResumen || !estadoResumen.id) {
      this.alertaService.error(
        'No se pudo procesar el pago. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        'flex justify-center transition-all ease-in-out w-full text-lg',
      );
      this.dreservasService.setCargando(false);
      return;
    }

    setTimeout(() => {
      this.dreservasService
        .pagarReserva(estadoResumen.id)
        .then(response => {
          if (!response.data) {
            this.alertaService.error(
              `Error al procesar el pago. Por favor, inténtelo de nuevo.`,
              5 * 1000,
              this.alertaModalReservas(),
              'flex justify-center transition-all ease-in-out w-full text-lg',
            );
            this.dreservasService.setCargando(false);
            return;
          }

          this.dreservasService.setPago(false);
          this.dreservasService.setEstadoResumen(null);
          this.dreservasService.setResumen(false);
          window.location.href = response.data;
        })
        .catch(error => {
          const mensajeError =
            error.error?.error ||
            'Error al procesar el pago. Por favor, inténtelo de nuevo.';

          this.alertaService.error(
            mensajeError,
            5 * 1000,
            this.alertaModalReservas(),
            'flex justify-center transition-all ease-in-out w-full text-lg',
          );
          this.dreservasService.setCargando(false);
        });
    }, 1000);
  }

  public verMiReserva(idReserva: number | null) {
    if (!idReserva) return;

    this.dreservasService.setCargando(true);
    this.dreservasService.setIdMiReserva(idReserva);
    this.dreservasService.setResumen(false);
    this.dreservasService.setPago(false);

    setTimeout(() => {
      this.dreservasService.miReservaQuery
        .refetch()
        .then(() => {
          this.dreservasService.setMiReserva(
            this.dreservasService.miReservaQuery.data() || null,
          );
          this.dreservasService.setCargando(false);
        })
        .catch(error => {
          console.error('Error al obtener mi reserva:', error);
          this.alertaService.error(
            'Error al obtener la reserva. Por favor, inténtelo de nuevo.',
            5 * 1000,
            this.alertaModalReservas(),
            'flex justify-center transition-all ease-in-out w-full text-lg',
          );
          this.dreservasService.setCargando(false);
        });
    }, 1000);
  }
}
