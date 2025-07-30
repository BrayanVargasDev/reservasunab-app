import {
  Component,
  inject,
  Injector,
  effect,
  viewChild,
  ElementRef,
  ViewContainerRef,
  computed,
  ChangeDetectorRef,
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
import { ChangeDetectionStrategy } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ModalDreservasComponent {
  private injector = inject(Injector);
  private environment = environment;
  private authService = inject(AuthService);
  private alertaService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private estilosAlerta =
    'flex justify-center transition-all mx-auto ease-in-out w-[80%] text-lg';
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

  public miReserva = computed(() => {
    const reserva = this.dreservasService.miReserva();
    if (reserva && reserva.fecha) {
      return {
        ...reserva,
        fecha: moment(reserva.fecha + ' 12:00', 'YYYY-MM-DD HH:mm').format(
          'dddd, D [de] MMMM [de] YYYY',
        ),
      };
    }
    return reserva;
  });

  public necesitaPago = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    return (
      estado && estado.estado !== 'pagada' && estado.valor && estado.valor > 0
    );
  });

  public pudeCancelar = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    return estado?.puede_cancelar;
  });

  public puedeAgregarJugadores = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    return (
      estado &&
      estado.estado === 'pagada' &&
      estado.agrega_jugadores === true &&
      estado.jugadores &&
      estado.jugadores.length < estado.maximo_jugadores
    );
  });

  // Propiedades computadas para validaciones de jugadores
  public readonly mostrarJugadores = this.dreservasService.mostrarJugadores;
  public readonly terminoBusquedaJugadores =
    this.dreservasService.terminoBusquedaJugadores;
  public readonly jugadoresQuery = this.dreservasService.jugadoresQuery;
  public readonly jugadoresSeleccionados =
    this.dreservasService.jugadoresSeleccionados;

  public readonly limitesJugadores = computed(() => {
    return this.dreservasService.obtenerLimiteJugadores();
  });

  public readonly puedeAgregarMasJugadores = computed(() => {
    return this.dreservasService.puedeAgregarMasJugadores();
  });

  public readonly puedeSeleccionarJugador = computed(() => {
    return this.dreservasService.puedeSeleccionarJugador();
  });

  // Método para validar si un jugador específico se puede seleccionar
  public puedeSeleccionarJugadorEspecifico(jugadorId: number): boolean {
    const puede = this.dreservasService.puedeSeleccionarJugador(jugadorId);
    return puede;
  }

  public readonly mensajeEstado = computed(() => {
    const limites = this.limitesJugadores();
    if (limites.actual === 0) return '';

    const disponibles = limites.maximo - limites.actual;
    if (disponibles <= 0) {
      return `⚠️ La reserva ya tiene el máximo de jugadores (${limites.maximo})`;
    }

    return `📊 Jugadores actuales: ${limites.actual}/${limites.maximo} - Puedes agregar ${disponibles} más`;
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
    this.dreservasService.setCargando('Creando reserva...');

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
            this.estilosAlerta,
          );
          this.dreservasService.setMostrarDisponibilidad();
          return;
        }

        this.dreservasService.setMostrarResumenNueva(response.data);
      })
      .catch(error => {
        const mensajeError =
          error.error?.error ||
          'Error al iniciar la reserva. Por favor, inténtelo de nuevo.';

        this.alertaService.error(
          mensajeError,
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        this.dreservasService.setMostrarDisponibilidad();
      });
  }

  public procesarPago() {
    this.dreservasService.setProcesandoPago();

    const estadoResumen = this.estadoResumen() ?? this.miReserva();

    if (!estadoResumen || !estadoResumen.id) {
      this.alertaService.error(
        'No se pudo procesar el pago. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      // Volver al resumen correcto
      if (this.dreservasService.estadoResumen()) {
        this.dreservasService.setMostrarResumenNueva(
          this.dreservasService.estadoResumen()!,
        );
      } else if (this.dreservasService.miReserva()) {
        this.dreservasService.setMostrarResumenExistente(
          this.dreservasService.miReserva()!,
        );
      }
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
              this.estilosAlerta,
            );
            // Volver al resumen correcto
            if (this.dreservasService.estadoResumen()) {
              this.dreservasService.setMostrarResumenNueva(
                this.dreservasService.estadoResumen()!,
              );
            } else if (this.dreservasService.miReserva()) {
              this.dreservasService.setMostrarResumenExistente(
                this.dreservasService.miReserva()!,
              );
            }
            return;
          }

          // Cerrar modal y redirigir al gateway de pago
          this.dreservasService.cerrarModal();
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
            this.estilosAlerta,
          );
          // Volver al resumen correcto
          if (this.dreservasService.estadoResumen()) {
            this.dreservasService.setMostrarResumenNueva(
              this.dreservasService.estadoResumen()!,
            );
          } else if (this.dreservasService.miReserva()) {
            this.dreservasService.setMostrarResumenExistente(
              this.dreservasService.miReserva()!,
            );
          }
        });
    }, 1000);
  }

  public verMiReserva(idReserva: number | null) {
    if (!idReserva) return;

    this.dreservasService.setCargando('Cargando reserva...');
    this.dreservasService.setIdMiReserva(idReserva);

    setTimeout(() => {
      this.dreservasService.miReservaQuery
        .refetch()
        .then(() => {
          const reserva = this.dreservasService.miReservaQuery.data();
          if (reserva) {
            this.dreservasService.setMostrarResumenExistente(reserva);
          } else {
            this.alertaService.error(
              'No se pudo cargar la reserva.',
              5 * 1000,
              this.alertaModalReservas(),
              this.estilosAlerta,
            );
            this.dreservasService.setMostrarDisponibilidad();
          }
        })
        .catch(error => {
          console.error('Error al obtener mi reserva:', error);
          this.alertaService.error(
            'Error al obtener la reserva. Por favor, inténtelo de nuevo.',
            5 * 1000,
            this.alertaModalReservas(),
            this.estilosAlerta,
          );
          this.dreservasService.setMostrarDisponibilidad();
        });
    }, 1000);
  }

  // Métodos para jugadores
  public mostrarAgregarJugadores() {
    this.dreservasService.setMostrarJugadores();
  }

  public onBuscarJugadores(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dreservasService.setTerminoBusquedaJugadores(input.value);
  }

  public agregarJugador(jugador: any) {
    // Validar si se puede seleccionar este jugador específico
    if (!this.puedeSeleccionarJugadorEspecifico(jugador.id)) {
      // Si ya está seleccionado, no mostrar error
      if (this.esJugadorSeleccionado(jugador.id)) {
        return;
      }

      const limites = this.limitesJugadores();
      const disponibles = limites.maximo - limites.totalFinal;
      this.alertaService.error(
        `No puedes seleccionar más jugadores. Límite máximo alcanzado: ${limites.maximo}`,
        3 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    this.dreservasService.agregarJugadorSeleccionado(jugador);
  }

  public removerJugador(jugadorId: number) {
    this.dreservasService.removerJugadorSeleccionado(jugadorId);
  }

  public esJugadorSeleccionado(jugadorId: number): boolean {
    const seleccionados = this.dreservasService.jugadoresSeleccionados();
    const estaSeleccionado = seleccionados.some(j => j.id === jugadorId);
    return estaSeleccionado;
  }

  public cancelarAgregarJugadores() {
    // Regresar al resumen correcto
    if (this.dreservasService.estadoResumen()) {
      this.dreservasService.setMostrarResumenNueva(
        this.dreservasService.estadoResumen()!,
      );
    } else if (this.dreservasService.miReserva()) {
      this.dreservasService.setMostrarResumenExistente(
        this.dreservasService.miReserva()!,
      );
    }
    this.dreservasService.limpiarJugadoresSeleccionados();
    this.dreservasService.setTerminoBusquedaJugadores('');
  }

  public async confirmarAgregarJugadores() {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();

    if (!estado || !estado.id) {
      this.alertaService.error(
        'No se pudo agregar los jugadores. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    // Validar las reglas de jugadores
    const validacion = this.dreservasService.validarAgregarJugadores();
    if (!validacion.esValido) {
      this.alertaService.error(
        validacion.mensaje,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    // Guardar información necesaria antes de limpiar
    const numJugadoresAAgregar =
      this.dreservasService.jugadoresSeleccionados().length;
    const esNuevaReserva = !!this.dreservasService.estadoResumen();
    const esReservaExistente = !!this.dreservasService.miReserva();

    this.dreservasService.setCargando('Agregando jugadores...');

    try {
      const response = await this.dreservasService.agregarJugadores(estado.id);

      if (!response.data) {
        this.alertaService.error(
          'Error al agregar jugadores. Por favor, inténtelo de nuevo.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        // Regresar al estado correcto sin limpiar
        if (esNuevaReserva) {
          this.dreservasService.setMostrarResumenNueva(estado);
        } else if (esReservaExistente) {
          this.dreservasService.setMostrarResumenExistente(estado);
        }
        return;
      }

      // Limpiar datos de jugadores seleccionados DESPUÉS de tener la respuesta
      this.dreservasService.limpiarJugadoresSeleccionados();
      this.dreservasService.setTerminoBusquedaJugadores('');

      // Actualizar los datos y regresar al resumen apropiado
      if (esNuevaReserva) {
        this.dreservasService.setMostrarResumenNueva(response.data);
      } else if (esReservaExistente) {
        this.dreservasService.setMostrarResumenExistente(response.data);
      }

      // Forzar detección de cambios y mostrar alerta después
      this.cdr.detectChanges();

      // Usar setTimeout con tiempo mínimo para que la alerta aparezca después del render
      setTimeout(() => {
        this.alertaService.success(
          `Se agregaron ${numJugadoresAAgregar} jugador(es) exitosamente. Total actual: ${
            response.data.jugadores?.length || 0
          }`,
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
      }, 50);
    } catch (error: any) {
      console.error('Error al agregar jugadores:', error);
      const mensajeError =
        error.error?.error ||
        'Error al agregar jugadores. Por favor, inténtelo de nuevo.';

      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );

      // En caso de error, regresar al resumen correcto sin limpiar jugadores seleccionados
      if (esNuevaReserva) {
        this.dreservasService.setMostrarResumenNueva(estado);
      } else if (esReservaExistente) {
        this.dreservasService.setMostrarResumenExistente(estado);
      }
    }
  }

  public cancelarReserva() {
    this.dreservasService.setCancelandoReserva();

    const estadoResumen = this.estadoResumen() ?? this.miReserva();

    if (!estadoResumen || !estadoResumen.id) {
      this.alertaService.error(
        'No se pudo cancelar la reserva. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      // Volver al resumen correcto
      if (this.dreservasService.estadoResumen()) {
        this.dreservasService.setMostrarResumenNueva(
          this.dreservasService.estadoResumen()!,
        );
      } else if (this.dreservasService.miReserva()) {
        this.dreservasService.setMostrarResumenExistente(
          this.dreservasService.miReserva()!,
        );
      }
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
              this.estilosAlerta,
            );
            // Volver al resumen correcto
            if (this.dreservasService.estadoResumen()) {
              this.dreservasService.setMostrarResumenNueva(
                this.dreservasService.estadoResumen()!,
              );
            } else if (this.dreservasService.miReserva()) {
              this.dreservasService.setMostrarResumenExistente(
                this.dreservasService.miReserva()!,
              );
            }
            return;
          }
          // TODO: Manejar el éxito del pago
        })
        .catch(error => {
          const mensajeError =
            error.error?.error ||
            'Error al cancelar. Por favor, inténtelo de nuevo.';

          this.alertaService.error(
            mensajeError,
            5 * 1000,
            this.alertaModalReservas(),
            this.estilosAlerta,
          );
          // Volver al resumen correcto
          if (this.dreservasService.estadoResumen()) {
            this.dreservasService.setMostrarResumenNueva(
              this.dreservasService.estadoResumen()!,
            );
          } else if (this.dreservasService.miReserva()) {
            this.dreservasService.setMostrarResumenExistente(
              this.dreservasService.miReserva()!,
            );
          }
        });
    }, 1000);
  }

  public manejarCierreModal(): void {
    // Si estamos en la pantalla de disponibilidad (estado por defecto), cerrar completamente
    if (
      !this.dreservasService.mostrandoResumenNueva() &&
      !this.dreservasService.mostrandoResumenExistente() &&
      !this.dreservasService.mostrandoJugadores()
    ) {
      this.dreservasService.cerrarModal();
    } else {
      this.dreservasService.setMostrarDisponibilidad();
    }
  }
}
