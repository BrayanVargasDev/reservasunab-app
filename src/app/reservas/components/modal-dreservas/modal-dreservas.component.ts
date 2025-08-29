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
  ChangeDetectionStrategy,
} from '@angular/core';
import { DreservasService } from '@reservas/services/dreservas.service';
import { CommonModule } from '@angular/common';

import { QuillViewHTMLComponent } from 'ngx-quill';
import {
  format,
  parse,
  subDays,
  set as setTime,
  parseISO,
  isValid,
} from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';

import { environment } from '@environments/environment';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Configuracion } from '@espacios/interfaces';
import { AuthService } from '@auth/services/auth.service';
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
    InfoReservaComponent,
    QuillViewHTMLComponent,
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

  constructor() {}
  public dreservasModal =
    viewChild<ElementRef<HTMLDialogElement>>('dreservasModal');

  public alertaModalReservas = viewChild.required('alertaModalReservas', {
    read: ViewContainerRef,
  });

  public cargando = computed(() => this.dreservasService.cargando());

  private parsearFecha(rawFecha: string): Date | null {
    if (!rawFecha) {
      return null;
    }

    let fechaBase: Date | null = null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawFecha)) {
      fechaBase = parse(
        rawFecha + 'T12:00:00',
        "yyyy-MM-dd'T'HH:mm:ss",
        new Date(),
      );
    } else {
      const d = parseISO(rawFecha);
      fechaBase = isValid(d) ? d : null;
    }

    if (!fechaBase) {
      const d = new Date(rawFecha);
      fechaBase = isValid(d) ? d : null;
    }

    return fechaBase;
  }

  public estadoResumen = computed(() => {
    const estado = this.dreservasService.estadoResumen();

    if (!estado || !estado.fecha) {
      return estado;
    }

    const {
      fecha,
      es_pasada,
      estado: estadoReserva,
      valor,
      valor_descuento,
      necesita_aprobacion,
      reserva_aprovada,
    } = estado;
    const usuario = this.authService.usuario();

    const puedePagar =
      !es_pasada &&
      estadoReserva !== 'pagada' &&
      valor > 0 &&
      (!necesita_aprobacion || reserva_aprovada);

    const valorFinal = (valor ?? 0) - (valor_descuento ?? 0);

    const pagarConSaldo = puedePagar && (usuario?.saldo ?? 0) >= valorFinal;

    const fechaParseada = this.parsearFecha(fecha);

    return {
      ...estado,
      fecha: fechaParseada
        ? formatInBogota(fechaParseada, "eeee, d 'de' MMMM 'de' yyyy")
        : fecha,
      pagar_con_saldo: pagarConSaldo,
    };
  });

  public miReserva = computed(() => {
    const reserva = this.dreservasService.miReserva();
    if (reserva && reserva.fecha) {
      const usuario = this.authService.usuario();
      const puedePagar =
        !reserva.es_pasada &&
        reserva.estado !== 'pagada' &&
        reserva.valor > 0 &&
        (!reserva.necesita_aprobacion || reserva.reserva_aprovada);
      const valorFinal = (reserva.valor || 0) - (reserva.valor_descuento || 0);
      const pagarConSaldo =
        puedePagar && usuario ? usuario.saldo >= valorFinal : false;
      // Parseo tolerante de fecha
      const rawFecha = reserva.fecha as string;
      let fechaBase: Date | null = null;
      try {
        if (/^\d{4}-\d{2}-\d{2}$/.test(rawFecha)) {
          fechaBase = parse(
            rawFecha + ' 12:00',
            'yyyy-MM-dd HH:mm',
            new Date(),
          );
        } else if (rawFecha.includes('T')) {
          const d = parseISO(rawFecha);
          fechaBase = isValid(d) ? d : null;
        } else {
          const d = new Date(rawFecha);
          fechaBase = isValid(d) ? d : null;
        }
      } catch {
        fechaBase = null;
      }
      return {
        ...reserva,
        fecha: fechaBase
          ? formatInBogota(fechaBase, "eeee, d 'de' MMMM 'de' yyyy")
          : reserva.fecha,
        pagar_con_saldo: pagarConSaldo,
      } as any;
    }
    return reserva;
  });

  public necesitaPago = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();

    if (!estado) return false;
    if (estado.estado === 'completada') return false;
    if (this.esReservaPasada()) return false;
    if (estado.necesita_aprobacion && !estado.reserva_aprovada) return false;
    return (
      estado.estado !== 'pagada' &&
      !!estado.valor_descuento &&
      estado.valor_descuento > 0
    );
  });

  public puedePagarConSaldo = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();

    if (estado?.estado === 'completada') return false;
    if (this.esReservaPasada()) return false;
    if (!estado) return false;
    return estado.pagar_con_saldo;
  });

  public pudeCancelar = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();

    if (this.esReservaPasada()) return false;
    return estado?.puede_cancelar;
  });

  public esReservaPasada = computed(() => {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    return estado?.es_pasada;
  });

  public readonly mostrarJugadores = this.dreservasService.mostrarJugadores;
  public readonly terminoBusquedaJugadores =
    this.dreservasService.terminoBusquedaJugadores;
  public readonly jugadoresQuery = this.dreservasService.jugadoresQuery;
  public readonly jugadoresSeleccionados =
    this.dreservasService.jugadoresSeleccionados;

  public readonly userIdActual = computed(() => this.authService.usuario()?.id);
  public readonly reservanteActual = computed(() => {
    const u = this.authService.usuario();
    if (!u) return null;
    return {
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
    } as any;
  });
  public readonly listaJugadoresSeleccionados = computed(() => {
    const base = this.dreservasService.jugadoresSeleccionados();
    const reservante = this.reservanteActual();
    if (!reservante) return base;
    return [reservante, ...base];
  });

  public readonly confirmarReservaDisabled = computed(() => {
    const estado = this.dreservasService.estadoResumen();
    if (!estado) return true;

    // Si estado.estado es pendienteap y estado.id === null entonces false
    if (estado.estado === 'pendienteap' && estado.id === null) return false;

    const minOtros = Math.max(0, (estado.minimo_jugadores || 0) - 1);
    const totalOtros = estado.jugadores?.length || 0;
    return totalOtros < minOtros || this.cargando();
  });

  public readonly limitesJugadores = computed(() =>
    this.dreservasService.obtenerLimiteJugadores(),
  );

  public readonly puedeAgregarMasJugadores = computed(() =>
    this.dreservasService.puedeAgregarMasJugadores(),
  );

  public readonly puedeSeleccionarJugador = computed(() =>
    this.dreservasService.puedeSeleccionarJugador(),
  );

  public puedeSeleccionarJugadorEspecifico(jugadorId: number): boolean {
    return this.dreservasService.puedeSeleccionarJugador(jugadorId);
  }

  public readonly mensajeEstado = computed(() => {
    const limites = this.limitesJugadores();
    if (limites.maximo === 0) return '';

    const disponibles = limites.maximo - limites.totalFinal;
    if (disponibles <= 0) {
      return `⚠️ Ya no puedes agregar más jugadores. Máximo de acompañantes: ${limites.maximo}`;
    }

    const conteoConReservante = limites.actual + 1;
    return `📊 Jugadores (incluyéndote): ${conteoConReservante}/${
      limites.maximo + 1
    } - Puedes agregar ${disponibles} más`;
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
        ? parse(fechaFiltro, 'yyyy-MM-dd', new Date())
        : new Date();

      let fechaApertura = subDays(
        fechaBase,
        configuracion.dias_previos_apertura,
      );

      const [horas, minutos] = configuracion.hora_apertura
        .split(':')
        .map(n => parseInt(n, 10));

      const tipoUsuarioConfig = tipo_usuario_config.find(
        config =>
          config.tipo_usuario[0] ===
          this.authService.usuario()?.tipo_usuario[0],
      );

      const minutosTotales = tipoUsuarioConfig
        ? minutos + tipoUsuarioConfig.retraso_reserva
        : minutos;

      fechaApertura = setTime(fechaApertura, {
        hours: horas,
        minutes: minutosTotales,
        seconds: 0,
        milliseconds: 0,
      });

      return formatInBogota(fechaApertura, 'dd/MM/yyyy HH:mm a');
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

    if (
      item.novedad ||
      !item.disponible ||
      item.reserva_pasada ||
      item.reservada
    ) {
      return;
    }

    const fechaFiltro = this.dreservasService.fecha();
    const fechaBaseStr = fechaFiltro
      ? format(parse(fechaFiltro, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
      : formatInBogota(new Date(), 'yyyy-MM-dd');

    this.dreservasService.setCargando('Configurando reserva...');

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.dreservasService
      .iniciarReserva(base, fechaBaseStr, item.hora_inicio, item.hora_fin)
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
        .then((response: any) => {
          if (!response.data) {
            this.alertaService.error(
              `Error al procesar el pago. Por favor, inténtelo de nuevo.`,
              5 * 1000,
              this.alertaModalReservas(),
              this.estilosAlerta,
            );
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

          this.dreservasService.cerrarModal();
          window.location.href = response.data;
        })
        .catch((error: any) => {
          const mensajeError =
            error.error?.error ||
            'Error al procesar el pago. Por favor, inténtelo de nuevo.';

          this.alertaService.error(
            mensajeError,
            5 * 1000,
            this.alertaModalReservas(),
            this.estilosAlerta,
          );
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

  public async procesarPagoConSaldo() {
    this.dreservasService.setProcesandoPago();

    const estadoResumen = this.estadoResumen() ?? this.miReserva();

    if (!estadoResumen || !estadoResumen.id) {
      this.alertaService.error(
        'No se pudo procesar el pago con saldo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
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

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const data = await this.dreservasService.pagarReservaConSaldo(
        estadoResumen.id,
      );
      if (!data) {
        this.alertaService.error(
          'Error al procesar el pago con saldo.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
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

      try {
        const result = await this.dreservasService.miReservaQuery.refetch();
        const reservaActualizada =
          result.data || this.dreservasService.miReserva();
        if (reservaActualizada) {
          this.dreservasService.setMostrarResumenExistente(reservaActualizada);
        } else {
          if (this.dreservasService.miReserva()) {
            this.dreservasService.setMostrarResumenExistente(
              this.dreservasService.miReserva()!,
            );
          }
        }
      } catch {
        if (this.dreservasService.miReserva()) {
          this.dreservasService.setMostrarResumenExistente(
            this.dreservasService.miReserva()!,
          );
        }
      }

      this.alertaService.success(
        'Pago realizado con saldo exitosamente.',
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
    } catch (error: any) {
      const mensajeError =
        error.error?.error || 'Error al procesar el pago con saldo.';
      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      if (this.dreservasService.estadoResumen()) {
        this.dreservasService.setMostrarResumenNueva(
          this.dreservasService.estadoResumen()!,
        );
      } else if (this.dreservasService.miReserva()) {
        this.dreservasService.setMostrarResumenExistente(
          this.dreservasService.miReserva()!,
        );
      }
    }
  }

  public async verMiReserva(idReserva: number | null) {
    if (!idReserva) return;

    this.dreservasService.setCargando('Cargando reserva...');
    this.dreservasService.setIdMiReserva(idReserva);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const result = await this.dreservasService.miReservaQuery.refetch();
      const reserva = result.data;

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
    } catch (error) {
      console.error('Error al obtener mi reserva:', error);
      this.alertaService.error(
        'Error al obtener la reserva. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      this.dreservasService.setMostrarDisponibilidad();
    }
  }

  public mostrarAgregarJugadores() {
    this.dreservasService.setMostrarJugadores();
  }

  public onBuscarJugadores(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dreservasService.setTerminoBusquedaJugadores(input.value);
  }

  public agregarJugador(jugador: any) {
    const idActual = this.userIdActual();
    if (idActual && jugador.id === idActual) {
      this.alertaService.error(
        'Ya eres parte de la reserva como reservante. No es necesario agregarte.',
        3 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!this.puedeSeleccionarJugadorEspecifico(jugador.id)) {
      if (this.esJugadorSeleccionado(jugador.id)) return;

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
    return seleccionados.some(j => j.id === jugadorId);
  }

  public yaEstaEnReserva(jugadorId: number): boolean {
    const estado =
      this.dreservasService.estadoResumen() ||
      this.dreservasService.miReserva();
    const lista = estado?.jugadores || [];
    return lista.some(j => j.id === jugadorId);
  }

  public cancelarAgregarJugadores() {
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
    const esNueva = !!this.dreservasService.estadoResumen();
    const estado = esNueva
      ? this.dreservasService.estadoResumen()
      : this.dreservasService.miReserva();

    if (!estado) {
      this.alertaService.error(
        'No hay una reserva para agregar jugadores.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    const limites = this.dreservasService.obtenerLimiteJugadores();
    if (limites.totalFinal > limites.maximo) {
      const disponibles = limites.maximo - limites.actual;
      this.alertaService.error(
        `Solo puedes agregar ${disponibles} jugador(es) más. Máximo permitido: ${limites.maximo}`,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    const cantidad = this.dreservasService.jugadoresSeleccionados().length;

    if (esNueva) {
      this.dreservasService.confirmarAgregarJugadoresLocal();
      this.dreservasService.setMostrarResumenNueva(
        this.dreservasService.estadoResumen()!,
      );
    } else {
      this.dreservasService.confirmarAgregarJugadoresLocalEnExistente();
      this.dreservasService.setMostrarResumenExistente(
        this.dreservasService.miReserva()!,
      );
    }
    this.dreservasService.setTerminoBusquedaJugadores('');
    this.cdr.detectChanges();

    setTimeout(() => {
      this.alertaService.success(
        `Se agregaron ${cantidad} jugador(es) localmente.`,
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
    }, 50);
  }

  public async confirmarReservaFinal() {
    const estado = this.dreservasService.estadoResumen()!;

    const minOtros = Math.max(0, (estado.minimo_jugadores ?? 0) - 1);
    const totalJug = estado.jugadores?.length ?? 0;
    if (minOtros > 0 && totalJug < minOtros) {
      this.alertaService.error(
        `Debes agregar al menos ${minOtros} jugador(es) además del reservante.`,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    const base = this.dreservasService.espacioDetallesQuery.data();
    const configId = base?.configuracion?.id ?? 0;
    if (!configId || configId <= 0) {
      this.alertaService.error(
        'Falta la configuración base del espacio.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.fecha) {
      this.alertaService.error(
        'Falta la fecha de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.hora_inicio) {
      this.alertaService.error(
        'Falta la hora de inicio de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    this.dreservasService.setCargando('Confirmando reserva...');
    try {
      const response = await this.dreservasService.confirmarReservaFinal();

      if (!response.data) {
        this.alertaService.error(
          'No se pudo confirmar la reserva.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        this.dreservasService.setMostrarResumenNueva(estado);
        return;
      }

      this.alertaService.success(
        'Reserva creada exitosamente.',
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
    } catch (error: any) {
      const mensajeError =
        error?.error?.error || 'Error al confirmar la reserva.';
      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      this.dreservasService.setMostrarResumenNueva(estado);
    }
  }

  public async confirmarYPagar() {
    const estado = this.dreservasService.estadoResumen()!;

    const minOtros = Math.max(0, (estado.minimo_jugadores ?? 0) - 1);
    const totalJug = estado.jugadores?.length ?? 0;
    if (estado.puede_agregar_jugadores && minOtros > 0 && totalJug < minOtros) {
      this.alertaService.error(
        `Debes agregar al menos ${minOtros} jugador(es) además del reservante.`,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    const base = this.dreservasService.espacioDetallesQuery.data();
    const configId = base?.configuracion?.id ?? 0;
    if (!configId || configId <= 0) {
      this.alertaService.error(
        'Falta la configuración base del espacio.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.fecha) {
      this.alertaService.error(
        'Falta la fecha de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.hora_inicio) {
      this.alertaService.error(
        'Falta la hora de inicio de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    this.dreservasService.setCargando('Confirmando reserva...');
    try {
      const response = await this.dreservasService.confirmarReservaFinal();

      if (!response.data) {
        this.alertaService.error(
          'No se pudo confirmar la reserva.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        this.dreservasService.setMostrarResumenNueva(estado);
        return;
      }

      this.alertaService.success(
        'Reserva creada exitosamente.',
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );

      if (!this.necesitaPago()) {
        return;
      }
      this.procesarPago();
    } catch (error: any) {
      const mensajeError =
        error?.error?.error || 'Error al confirmar la reserva.';
      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      this.dreservasService.setMostrarResumenNueva(estado);
    }
  }

  public async confirmarYPagarConSaldo() {
    const estado = this.dreservasService.estadoResumen()!;

    const minOtros = Math.max(0, (estado.minimo_jugadores ?? 0) - 1);
    const totalJug = estado.jugadores?.length ?? 0;
    if (minOtros > 0 && totalJug < minOtros) {
      this.alertaService.error(
        `Debes agregar al menos ${minOtros} jugador(es) además del reservante.`,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    const base = this.dreservasService.espacioDetallesQuery.data();
    const configId = base?.configuracion?.id ?? 0;
    if (!configId || configId <= 0) {
      this.alertaService.error(
        'Falta la configuración base del espacio.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.fecha) {
      this.alertaService.error(
        'Falta la fecha de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    if (!estado.hora_inicio) {
      this.alertaService.error(
        'Falta la hora de inicio de la reserva.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      return;
    }

    this.dreservasService.setCargando('Confirmando reserva...');
    try {
      const response = await this.dreservasService.confirmarReservaFinal();

      if (!response.data) {
        this.alertaService.error(
          'No se pudo confirmar la reserva.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        this.dreservasService.setMostrarResumenNueva(estado);
        return;
      }

      this.alertaService.success(
        'Reserva creada exitosamente.',
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );

      // Encadenar el pago con saldo automáticamente
      if (!this.necesitaPago()) {
        return;
      }
      await this.procesarPagoConSaldo();
    } catch (error: any) {
      const mensajeError =
        error?.error?.error || 'Error al confirmar la reserva.';
      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      this.dreservasService.setMostrarResumenNueva(estado);
    }
  }

  public async cancelarReserva() {
    // Confirmación previa con el sistema de alertas de la app
    const confirmado = await this.alertaService.confirmacion({
      tipo: 'error',
      titulo: 'Cancelar reserva',
      mensaje:
        '¿Deseas cancelar esta reserva? Esta acción no se puede deshacer.',
      referencia: this.alertaModalReservas(),
      botones: [
        { texto: 'No, volver', tipo: 'cancelar', estilo: 'btn-ghost' },
        {
          texto: 'Sí, cancelar',
          tipo: 'confirmar',
        },
      ],
    });
    if (!confirmado) return;

    // Activar estado de carga de cancelación en la UI
    this.dreservasService.setCancelandoReserva();

    // Determinar si la vista actual era una reserva nueva o existente
    const esNueva = !!this.estadoResumen();
    const estadoResumen = this.estadoResumen() ?? this.miReserva();

    if (!estadoResumen || !estadoResumen.id) {
      this.alertaService.error(
        'No se pudo cancelar la reserva. Por favor, inténtelo de nuevo.',
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      if (esNueva && this.dreservasService.estadoResumen()) {
        this.dreservasService.setMostrarResumenNueva(
          this.dreservasService.estadoResumen()!,
        );
      } else if (!esNueva && this.dreservasService.miReserva()) {
        this.dreservasService.setMostrarResumenExistente(
          this.dreservasService.miReserva()!,
        );
      }
      return;
    }

    await new Promise<void>(resolve => setTimeout(resolve, 500));

    try {
      const response = await this.dreservasService.cancelarReserva(
        estadoResumen.id,
      );

      if (!response.data) {
        this.alertaService.error(
          'No se pudo cancelar la reserva.',
          5 * 1000,
          this.alertaModalReservas(),
          this.estilosAlerta,
        );
        if (esNueva) {
          this.dreservasService.setMostrarResumenNueva(
            this.dreservasService.estadoResumen() || estadoResumen,
          );
        } else {
          this.dreservasService.setMostrarResumenExistente(
            this.dreservasService.miReserva() || estadoResumen,
          );
        }
        return;
      }

      this.alertaService.success(
        'Reserva cancelada exitosamente.',
        4 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      this.dreservasService.setMostrarDisponibilidad();
    } catch (error: any) {
      const mensajeError =
        error?.error?.error ||
        error?.errors?.error ||
        'Error al cancelar la reserva.';
      this.alertaService.error(
        mensajeError,
        5 * 1000,
        this.alertaModalReservas(),
        this.estilosAlerta,
      );
      if (esNueva) {
        this.dreservasService.setMostrarResumenNueva(
          this.dreservasService.estadoResumen() || estadoResumen,
        );
      } else {
        this.dreservasService.setMostrarResumenExistente(
          this.dreservasService.miReserva() || estadoResumen,
        );
      }
    }
  }

  public manejarCierreModal(): void {
    if (this.dreservasService.abiertaDesdeMisReservas()) {
      this.dreservasService.cerrarModal();
      return;
    }

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
