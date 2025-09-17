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
  signal,
} from '@angular/core';
import { DreservasService } from '@reservas/services/dreservas.service';
import { CommonModule } from '@angular/common';

import { QuillViewHTMLComponent } from 'ngx-quill';
import { format, parse, subDays, set as setTime } from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';
import { parseFlexibleDate } from '@shared/utils/date-flex';

import { environment } from '@environments/environment';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Configuracion, TipoUsuarioConfig } from '@espacios/interfaces';
import { AuthService } from '@auth/services/auth.service';
import { AlertasService } from '@shared/services/alertas.service';
import {
  Disponibilidad,
  ReservaEspaciosDetalles,
} from '@reservas/interfaces/reserva-espacio-detalle.interface';
import { InfoReservaComponent } from '../info-reserva/info-reserva.component';
import { Elemento } from '@shared/interfaces';
import { TipoUsuario } from '@shared/enums/usuarios.enum';
import { AppService } from '@app/app.service';
import { ResumenReserva } from '@app/reservas/interfaces';
import { es } from 'date-fns/locale';
import { Pago } from '@pagos/interfaces';

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
  private appService = inject(AppService);
  private authService = inject(AuthService);
  private alertaService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private estilosAlerta =
    'flex justify-center transition-all mx-auto ease-in-out w-[80%] text-lg';
  public dreservasService = inject(DreservasService);
  public pagandoMensualidad = signal(false);

  constructor() {}
  public dreservasModal =
    viewChild<ElementRef<HTMLDialogElement>>('dreservasModal');

  public alertaModalReservas = viewChild.required('alertaModalReservas', {
    read: ViewContainerRef,
  });

  public cargando = computed(() => this.dreservasService.cargando());
  public permiteElementoDespuesReservado = computed(() => {
    const estado = this.getEstadoActual();

    if (!estado?.id) return true;

    return environment.elementosPostReserva;
  });
  public esEstudiante = computed(() => {
    return this.authService
      .usuario()
      ?.tipo_usuario.includes(TipoUsuario.Estudiante);
  });

  // Utilidades internas
  private showError(mensaje: string, ms = 5000) {
    this.alertaService.error(
      mensaje,
      ms,
      this.alertaModalReservas(),
      this.estilosAlerta,
    );
  }

  private showSuccess(mensaje: string, ms = 4000) {
    this.alertaService.success(
      mensaje,
      ms,
      this.alertaModalReservas(),
      this.estilosAlerta,
    );
  }

  private getEstadoActual() {
    return (
      this.dreservasService.estadoResumen() || this.dreservasService.miReserva()
    );
  }

  private isEstadoVacio(estado: any) {
    return (
      !estado ||
      (typeof estado === 'object' && Object.keys(estado).length === 0)
    );
  }

  private restoreResumenView() {
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

  private validarDatosReserva(
    estado: any,
    base: ReservaEspaciosDetalles | undefined,
    usarCondicionPuedeAgregar: boolean,
  ): string | null {
    const minOtros = estado.puede_agregar_jugadores
      ? Math.max(0, (estado?.minimo_jugadores ?? 0) - 1)
      : 0;
    const totalJug = estado.puede_agregar_jugadores
      ? estado?.jugadores?.length ?? 0
      : 0;

    if (
      (!usarCondicionPuedeAgregar && minOtros > 0 && totalJug < minOtros) ||
      (usarCondicionPuedeAgregar &&
        estado?.puede_agregar_jugadores &&
        minOtros > 0 &&
        totalJug < minOtros)
    ) {
      return `Debes agregar al menos ${minOtros} jugador(es) además del reservante.`;
    }

    const configId = base?.configuracion?.id ?? 0;
    if (!configId || configId <= 0)
      return 'Falta la configuración base del espacio.';
    if (!estado?.fecha) return 'Falta la fecha de la reserva.';
    if (!estado?.hora_inicio) return 'Falta la hora de inicio de la reserva.';
    return null;
  }

  private async confirmarReservaEnServidor(estado: any): Promise<boolean> {
    this.dreservasService.setCargando('Confirmando reserva...');
    try {
      const response = await this.dreservasService.confirmarReservaFinal();
      if (
        typeof response !== 'object' ||
        !('data' in response) ||
        !response.data
      ) {
        this.showError('No se pudo confirmar la reserva.');
        this.dreservasService.setMostrarResumenNueva(estado);
        return false;
      }
      this.showSuccess('Reserva creada exitosamente.', 4 * 1000);
      return true;
    } catch (error: any) {
      const mensajeError =
        error?.error?.error || 'Error al confirmar la reserva.';
      this.showError(mensajeError);
      this.dreservasService.setMostrarResumenNueva(estado);
      return false;
    }
  }

  public estadoResumen = computed(() => {
    const estado = this.dreservasService.estadoResumen();
    const saldo = this.appService.creditosQuery.data() ?? 0;
    if (!estado || !estado.fecha) {
      return estado;
    }

    const {
      fecha,
      es_pasada,
      estado: estadoReserva,
      valor_descuento,
      necesita_aprobacion,
      reserva_aprovada,
    } = estado;
    const usuario = this.authService.usuario();

    const puedePagar =
      !es_pasada &&
      (valor_descuento ?? 0) > 0 &&
      (!necesita_aprobacion || reserva_aprovada);

    const totalReserva =
      (estado as any)?.valor_total_reserva ?? valor_descuento ?? 0;

    const pagarConSaldo = puedePagar && (saldo ?? 0) >= (totalReserva ?? 0);

    const fechaParseada = parseFlexibleDate(fecha);

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
    const saldo = this.appService.creditosQuery.data() ?? 0;
    if (reserva && reserva.fecha) {
      const usuario = this.authService.usuario();
      const puedePagar =
        !reserva.es_pasada &&
        (reserva.valor_descuento ?? 0) > 0 &&
        (!reserva.necesita_aprobacion || reserva.reserva_aprovada);
      const totalReserva =
        (reserva as any)?.valor_total_reserva ?? (reserva.valor_descuento || 0);
      const pagarConSaldo =
        puedePagar && usuario ? saldo >= (totalReserva ?? 0) : false;

      const fechaBase = parseFlexibleDate(reserva.fecha as string);
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
    const estado = this.getEstadoActual();
    if (!estado) return false;
    if (this.isEstadoVacio(estado)) return false;
    if (this.esReservaPasada()) return false;
    if (estado.necesita_aprobacion) return false;
    if (estado.estado === 'completada') return false;
    if (estado.pago && (estado.pago as Pago).estado === 'OK') return false;
    let valorEspacio = Math.max(0, estado?.valor_descuento ?? 0);

    if (estado.cubierta_por_mensualidad) {
      valorEspacio = 0;
    }

    const totalReserva =
      (estado as ResumenReserva)?.valor_total_reserva ?? valorEspacio;
    if (totalReserva <= 0) return false;

    if (this.dreservasService.mostrandoResumenExistente()) return true;

    return !estado.pago && totalReserva > 0;
  });

  public puedePagarConSaldo = computed(() => {
    const estado = this.getEstadoActual();
    const saldo = this.appService.creditosQuery.data() ?? 0;
    const totalReserva = estado?.valor_total_reserva ?? 0;

    if (estado?.estado === 'completada') return false;
    if (this.esReservaPasada()) return false;
    if (!estado) return false;
    if (saldo <= 0) return false;
    if (totalReserva > saldo) return false;

    return estado.pagar_con_saldo;
  });

  public noConfirmada = computed(() => {
    const estado = this.getEstadoActual();

    return !estado?.id;
  });

  public noCancelada = computed(() => {
    const estado = this.getEstadoActual();

    return !estado?.estado?.toLowerCase().includes('cancelada');
  });

  public puedeAgregarElementos = computed(() => {
    const estado = this.getEstadoActual();
    if (!estado) return false;
    if (this.dreservasService.mostrandoDisponibilidad()) return false;
    if (this.dreservasService.mostrandoDetalles()) return false;
    if (this.dreservasService.mostrandoJugadores()) return false;
    if (!this.permiteElementoDespuesReservado()) return false;
    if (!this.noCancelada()) return false;
    if (this.esReservaPasada()) return false;

    return estado.puede_agregar_elementos;
  });


  public yaConfirmadaSinPago = computed(() => {
    const estado = this.getEstadoActual();
    if (!estado) return false;

    const yaConfirmada = estado.id;
    let sinPago = true;
    const pago = estado.pago;

    if (!pago) {
      sinPago = true;
      return yaConfirmada && sinPago;
    }

    if ('codigo' in pago && 'estado' in pago) {
      sinPago = pago.estado !== 'OK';
    }

    return yaConfirmada && sinPago;
  });

  public confirmadaConCambiosPendientes = computed(() => {
    this.dreservasService.requiereReconfirmacion();
    console.log({
      yaConfirmada: this.yaConfirmadaSinPago(),
      requiereReconfirmacion: this.dreservasService.requiereReconfirmacion(),
    });
    return (
      this.yaConfirmadaSinPago() &&
      this.dreservasService.requiereReconfirmacion()
    );
  });

  public pudeCancelar = computed(() => {
    const estado = this.getEstadoActual();

    if (this.esReservaPasada()) return false;
    return estado?.puede_cancelar;
  });

  public esReservaPasada = computed(() => {
    const estado = this.getEstadoActual();
    return estado?.es_pasada;
  });

  public readonly mostrarJugadores = this.dreservasService.mostrarJugadores;
  public readonly mostrarDetalles = this.dreservasService.mostrarDetalles;
  public readonly terminoBusquedaJugadores =
    this.dreservasService.terminoBusquedaJugadores;
  public readonly jugadoresQuery = this.dreservasService.jugadoresQuery;
  public readonly jugadoresSeleccionados =
    this.dreservasService.jugadoresSeleccionados;
  public readonly detallesSeleccionados =
    this.dreservasService.detallesSeleccionados;

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

  // Cantidades: mapa para inputs de búsqueda y para seleccionados
  public cantidadPorAgregar: Record<number, number> = {};

  public getPrecioUnitario(el: Elemento): number {
    const tipo = this.authService.usuario()?.tipo_usuario?.[0] as
      | TipoUsuario
      | undefined;
    switch (tipo) {
      case TipoUsuario.Estudiante:
        return el.valor_estudiante ?? 0;
      case TipoUsuario.Egresado:
        return el.valor_egresado ?? 0;
      case TipoUsuario.Administrativo:
        return el.valor_administrativo ?? 0;
      case TipoUsuario.Externo:
      default:
        return el.valor_externo ?? 0;
    }
  }

  public readonly confirmarReservaDisabled = computed(() => {
    const estado = this.getEstadoActual();
    if (!estado) return true;

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

  public onDialogCancel(event: Event): void {
    event.preventDefault();
    this.manejarCierreModal();
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
          this.showError(
            'Error al iniciar la reserva. Por favor, inténtelo de nuevo.',
            5 * 1000,
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

        this.showError(mensajeError, 5 * 1000);
        this.dreservasService.setMostrarDisponibilidad();
      });
  }

  // Metodo centralizado para confirmar y/o pagar
  public async ejecutarPago(
    tipo: 'normal' | 'saldo',
    confirmarPrimero = false,
  ): Promise<void> {
    const estado = this.getEstadoActual();

    if (this.isEstadoVacio(estado)) {
      this.showError('No se encontró información de reserva.');
      return;
    }

    const esNueva = !!this.dreservasService.estadoResumen();

    // Si NO se requiere confirmar primero, intentar pagar directamente
    if (!confirmarPrimero && !this.dreservasService.requiereReconfirmacion()) {
      if (!estado?.id) {
        const msg =
          tipo === 'saldo'
            ? 'No se pudo procesar el pago con saldo.'
            : 'No se pudo procesar el pago. Por favor, inténtelo de nuevo.';
        this.showError(msg);
        this.restoreResumenView();
        return;
      }
      const estadoActualizado = this.getEstadoActual() ?? estado;
      await this.realizarPago(tipo, estadoActualizado);
      return;
    }

    // Confirmar primero
    if (!esNueva && !this.dreservasService.requiereReconfirmacion()) {
      if (this.necesitaPago()) {
        await this.realizarPago(tipo, estado);
      }
      return;
    }

    const base = this.dreservasService.espacioDetallesQuery.data();
    const usarCondicionPuedeAgregar = tipo === 'normal' ? true : false;
    const errorValidacion = this.validarDatosReserva(
      estado,
      base,
      usarCondicionPuedeAgregar,
    );
    if (errorValidacion) {
      this.showError(errorValidacion);
      return;
    }

    const ok = await this.confirmarReservaEnServidor(estado);
    if (!ok) return;
    if (!this.necesitaPago()) return;

    // Reobtener estado por si se actualizó tras confirmar
    const estadoActualizado = this.getEstadoActual() ?? estado;
    await this.realizarPago(tipo, estadoActualizado);
  }

  private async realizarPago(
    tipo: 'normal' | 'saldo',
    estadoResumen: any,
  ): Promise<void> {
    if (tipo === 'normal') {
      this.dreservasService.setProcesandoPago();
      if (!estadoResumen || !estadoResumen.id) {
        this.showError(
          'No se pudo procesar el pago. Por favor, inténtelo de nuevo.',
        );
        this.restoreResumenView();
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const response: any = await this.dreservasService.pagarReserva(
          estadoResumen.id,
        );
        if (!response?.data) {
          this.showError(
            'Error al procesar el pago. Por favor, inténtelo de nuevo.',
          );
          this.restoreResumenView();
          return;
        }
        this.dreservasService.cerrarModal();
        window.location.href = response.data;
      } catch (error: any) {
        const mensajeError =
          error?.error?.error ||
          'Error al procesar el pago. Por favor, inténtelo de nuevo.';
        this.showError(mensajeError);
        this.restoreResumenView();
      }
      return;
    }

    // Pago con saldo
    this.dreservasService.setProcesandoPago();
    if (!estadoResumen || !estadoResumen.id) {
      this.showError('No se pudo procesar el pago con saldo.');
      this.restoreResumenView();
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await this.dreservasService.pagarReservaConSaldo(estadoResumen.id);
      try {
        const result = await this.dreservasService.miReservaQuery.refetch();
        const reservaActualizada =
          result.data || this.dreservasService.miReserva();
        if (reservaActualizada) {
          this.dreservasService.setMostrarResumenExistente(reservaActualizada);
        } else if (this.dreservasService.miReserva()) {
          this.dreservasService.setMostrarResumenExistente(
            this.dreservasService.miReserva()!,
          );
        }
      } catch {
        if (this.dreservasService.miReserva()) {
          this.dreservasService.setMostrarResumenExistente(
            this.dreservasService.miReserva()!,
          );
        }
      }
      this.showSuccess('Pago realizado con saldo exitosamente.', 4 * 1000);
    } catch (error: any) {
      const mensajeError =
        error?.error?.error || 'Error al procesar el pago con saldo.';
      this.showError(mensajeError);
      this.restoreResumenView();
    }
  }

  public procesarPago() {
    return this.ejecutarPago('normal');
  }

  public procesarPagoConSaldo() {
    return this.ejecutarPago('saldo');
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
        this.showError('No se pudo cargar la reserva.', 5 * 1000);
        this.dreservasService.setMostrarDisponibilidad();
      }
    } catch (error) {
      console.error('Error al obtener mi reserva:', error);
      this.showError(
        'Error al obtener la reserva. Por favor, inténtelo de nuevo.',
        5 * 1000,
      );
      this.dreservasService.setMostrarDisponibilidad();
    }
  }

  public mostrarAgregarJugadores() {
    this.dreservasService.setMostrarJugadores();
  }

  public mostrarAgregarDetalles() {
    this.dreservasService.setMostrarDetalles();
  }

  public onBuscarElementos(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.dreservasService.setTerminoBusquedaElementos(input?.value ?? '');
  }

  public onCantidadInput(id: number, event: Event) {
    const input = event.target as HTMLInputElement | null;
    const val = Math.max(1, parseInt(input?.value || '1', 10) || 1);
    this.cantidadPorAgregar[id] = val;
  }

  public agregarElemento(el: Elemento) {
    if (!el) return;
    const cant = this.cantidadPorAgregar[el.id] || 1;
    this.dreservasService.agregarElemento(el, cant);
  }

  public onBuscarJugadores(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dreservasService.setTerminoBusquedaJugadores(input.value);
  }

  public agregarJugador(jugador: any) {
    const idActual = this.userIdActual();
    if (idActual && jugador.id === idActual) {
      this.showError(
        'Ya eres parte de la reserva como reservante. No es necesario agregarte.',
        3 * 1000,
      );
      return;
    }

    if (!this.puedeSeleccionarJugadorEspecifico(jugador.id)) {
      if (this.esJugadorSeleccionado(jugador.id)) return;

      const limites = this.limitesJugadores();
      const disponibles = limites.maximo - limites.totalFinal;
      this.showError(
        `No puedes seleccionar más jugadores. Límite máximo alcanzado: ${limites.maximo}`,
        3 * 1000,
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

  public cancelarAgregarDetalles() {
    if (this.dreservasService.estadoResumen()) {
      this.dreservasService.setMostrarResumenNueva(
        this.dreservasService.estadoResumen()!,
      );
    } else if (this.dreservasService.miReserva()) {
      this.dreservasService.setMostrarResumenExistente(
        this.dreservasService.miReserva()!,
      );
    }
    this.dreservasService.limpiarDetallesSeleccionados();
    this.dreservasService.setTerminoBusquedaElementos('');
    this.cantidadPorAgregar = {};
  }

  public async confirmarAgregarJugadores() {
    const esNueva = !!this.dreservasService.estadoResumen();
    const estado = esNueva
      ? this.dreservasService.estadoResumen()
      : this.dreservasService.miReserva();

    if (!estado) {
      this.showError('No hay una reserva para agregar jugadores.', 5 * 1000);
      return;
    }

    const limites = this.dreservasService.obtenerLimiteJugadores();
    if (limites.totalFinal > limites.maximo) {
      const disponibles = limites.maximo - limites.actual;
      this.showError(
        `Solo puedes agregar ${disponibles} jugador(es) más. Máximo permitido: ${limites.maximo}`,
        5 * 1000,
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

  public confirmarAgregarDetalles() {
    const esNueva = !!this.dreservasService.estadoResumen();
    const estado = esNueva
      ? this.dreservasService.estadoResumen()
      : this.dreservasService.miReserva();

    if (!estado) {
      this.showError('No hay una reserva para agregar detalles.', 5 * 1000);
      return;
    }

    const cantidad = this.dreservasService.detallesSeleccionados().length;
    if (cantidad === 0) {
      this.showError(
        'Agrega al menos un elemento antes de confirmar.',
        3 * 1000,
      );
      return;
    }

    const seleccionados = this.dreservasService.detallesSeleccionados();
    const incremento = seleccionados.reduce((acc, el) => {
      const unit = this.getPrecioUnitario(el);
      const cant = el.cantidad_seleccionada || 1;
      if (unit > 0 && cant > 0) return acc + unit * cant;
      return acc;
    }, 0);

    if (esNueva) {
      this.dreservasService.confirmarAgregarDetallesLocal();
      const est = this.dreservasService.estadoResumen()!;
      const valorEspacioConDesc = est.valor_descuento || 0;
      const actualizado = {
        ...est,
        valor: est.valor || 0,
        valor_descuento: est.valor_descuento || 0,
        valor_elementos: (est.valor_elementos || 0) + incremento,
        valor_total_reserva:
          valorEspacioConDesc + (est.valor_elementos || 0) + incremento,
      } as typeof est;
      this.dreservasService.setMostrarResumenNueva(actualizado);
    } else {
      this.dreservasService.confirmarAgregarDetallesLocalEnExistente();
      const est = this.dreservasService.miReserva()!;

      const actualizado = {
        ...est,
        valor: est.valor || 0,
        valor_descuento: est.valor_descuento || 0,
        valor_elementos: (est.valor_elementos || 0) + incremento,
        valor_total_reserva: (est.valor_elementos || 0) + incremento,
      } as typeof est;
      this.dreservasService.setMostrarResumenExistente(actualizado);
    }
    this.cdr.detectChanges();

    setTimeout(() => {
      const total =
        this.dreservasService.detallesSeleccionados().length || cantidad;
      this.showSuccess(
        `Se agregaron ${total} detalle(s) localmente.`,
        4 * 1000,
      );
    }, 50);

    this.cantidadPorAgregar = {};
  }

  public removerElementoSeleccionado(el: any, index: number) {
    this.dreservasService.removerElemento(index);
  }

  public async confirmarReservaFinal() {
    const esNueva = !!this.dreservasService.estadoResumen();
    if (!esNueva) {
      const existente = this.dreservasService.miReserva();
      if (existente && this.necesitaPago()) {
        this.procesarPago();
      }
      return;
    }

    const estado = this.dreservasService.estadoResumen()!;
    const base = this.dreservasService.espacioDetallesQuery.data();
    const errorValidacion = this.validarDatosReserva(
      estado,
      base,
      estado.puede_agregar_jugadores,
    );
    if (errorValidacion) {
      this.showError(errorValidacion);
      return;
    }
    await this.confirmarReservaEnServidor(estado);
  }

  public async confirmarYPagar() {
    return this.ejecutarPago('normal', true);
  }

  public async confirmarYPagarConSaldo() {
    return this.ejecutarPago('saldo', true);
  }

  public async cancelarReserva() {
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

    this.dreservasService.setCancelandoReserva();

    const esNueva = !!this.estadoResumen();
    const estadoResumen = this.getEstadoActual();

    if (!estadoResumen || !estadoResumen.id) {
      this.showError(
        'No se pudo cancelar la reserva. Por favor, inténtelo de nuevo.',
      );
      if (esNueva) this.restoreResumenView();
      return;
    }

    await new Promise<void>(resolve => setTimeout(resolve, 500));

    try {
      const response = await this.dreservasService.cancelarReserva(
        estadoResumen.id,
      );

      if (!response.data) {
        this.showError('No se pudo cancelar la reserva.');
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

      this.showSuccess('Reserva cancelada exitosamente.', 4 * 1000);
      this.dreservasService.setMostrarDisponibilidad();
    } catch (error: any) {
      const mensajeError =
        error?.error?.error ||
        error?.errors?.error ||
        'Error al cancelar la reserva.';
      this.showError(mensajeError);
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

  public async pagarMensualidad(): Promise<void> {
    if (this.pagandoMensualidad()) return; // evitar clicks múltiples
    this.pagandoMensualidad.set(true);
    try {
      const resp = await this.dreservasService.pagarMensualidad();
      const url = resp?.data;
      if (!url) {
        this.showError('No se obtuvo la URL de pago de la mensualidad.');
        this.pagandoMensualidad.set(false);
        return;
      }
      window.location.assign(url);
    } catch (error: any) {
      const mensaje =
        error?.error?.error || 'Error al iniciar el pago de la mensualidad.';
      this.showError(mensaje);
      this.pagandoMensualidad.set(false);
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
      !this.dreservasService.mostrandoJugadores() &&
      !this.dreservasService.mostrandoDetalles()
    ) {
      this.dreservasService.cerrarModal();
    } else {
      this.dreservasService.setMostrarDisponibilidad();
    }
  }
}
