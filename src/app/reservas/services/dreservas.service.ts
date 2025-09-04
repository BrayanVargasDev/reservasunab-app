import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  getEspaciosAll,
  getEspacioDetalles,
  pagarMensualidad,
} from '@reservas/actions';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';
import { Elemento } from '@shared/interfaces';
import { Usuario } from '@usuarios/intefaces';
import {
  EspacioReservas,
  ReservaEspaciosDetalles,
  ResumenReserva,
} from '../interfaces';
import {
  iniciarReserva,
  pagarReserva,
  getMiReserva,
  buscarJugadores,
  agregarJugadoresReserva,
  pagarReservaConSaldo,
  confirmarReserva,
  eliminarReserva as eliminarReservaAction,
  buscarElementos,
} from '../actions';

// Definir tipos para el estado del modal
const EstadoModal = {
  DISPONIBILIDAD: 'disponibilidad',
  CARGANDO: 'cargando',
  RESUMEN_NUEVA: 'resumen_nueva',
  RESUMEN_EXISTENTE: 'resumen_existente',
  AGREGAR_JUGADORES: 'agregar_jugadores',
  AGREGAR_DETALLES: 'agregar_detalles',
  PROCESANDO_PAGO: 'procesando_pago',
  CANCELANDO_RESERVA: 'cancelando_reserva',
} as const;

type EstadoModalType = (typeof EstadoModal)[keyof typeof EstadoModal];

@Injectable({
  providedIn: 'root',
})
export class DreservasService {
  private http = inject(HttpClient);

  private _fecha = signal<string | null>(null);
  private _idGrupo = signal<number | null>(null);
  private _idSede = signal<number | null>(null);
  private _idCategoria = signal<number | null>(null);
  private _idEspacio = signal<number | null>(null);
  private _modalAbierta = signal(false);
  private _abiertaDesdeMisReservas = signal(false);

  // ? Estado unificado para las reservas
  private _estadoModal = signal<EstadoModalType>(EstadoModal.DISPONIBILIDAD);
  private _mensajeCargando = signal<string>('');
  private _estadoResumen = signal<ResumenReserva | null>(null);
  private _miReserva = signal<ResumenReserva | null>(null);
  private _idMiReserva = signal<number | null>(null);

  // ? Estado para jugadores
  private _termino_busqueda_jugadores = signal<string>('');
  private _jugadoresSeleccionados = signal<Usuario[]>([]);

  // ? Estado para elementos seleccionados (antes "detalles")
  private _detallesSeleccionados = signal<Elemento[]>([]);
  private _termino_busqueda_elementos = signal<string>('');
  // Flag para indicar si hay cambios locales en una reserva existente que requieren reconfirmación
  private _requiere_reconfirmacion = signal<boolean>(false);

  // Computed properties para el estado
  public estadoModal = computed(() => this._estadoModal());
  public mensajeCargando = computed(() => this._mensajeCargando());
  public estadoResumen = computed(() => this._estadoResumen());
  public miReserva = computed(() => this._miReserva());
  public idMiReserva = computed(() => this._idMiReserva());
  public terminoBusquedaJugadores = computed(() =>
    this._termino_busqueda_jugadores(),
  );
  public jugadoresSeleccionados = computed(() =>
    this._jugadoresSeleccionados(),
  );
  public detallesSeleccionados = computed(() => this._detallesSeleccionados());
  public terminoBusquedaElementos = computed(() =>
    this._termino_busqueda_elementos(),
  );
  public requiereReconfirmacion = computed(() =>
    this._requiere_reconfirmacion(),
  );

  // Estados derivados para compatibilidad y claridad
  public cargando = computed(
    () =>
      this._estadoModal() === EstadoModal.CARGANDO ||
      this._estadoModal() === EstadoModal.PROCESANDO_PAGO ||
      this._estadoModal() === EstadoModal.CANCELANDO_RESERVA,
  );
  public mostrandoDisponibilidad = computed(
    () => this._estadoModal() === EstadoModal.DISPONIBILIDAD,
  );
  public mostrandoResumenNueva = computed(
    () => this._estadoModal() === EstadoModal.RESUMEN_NUEVA,
  );
  public mostrandoResumenExistente = computed(
    () => this._estadoModal() === EstadoModal.RESUMEN_EXISTENTE,
  );
  public mostrandoJugadores = computed(
    () => this._estadoModal() === EstadoModal.AGREGAR_JUGADORES,
  );
  public mostrandoDetalles = computed(
    () => this._estadoModal() === EstadoModal.AGREGAR_DETALLES,
  );
  public procesandoPago = computed(
    () => this._estadoModal() === EstadoModal.PROCESANDO_PAGO,
  );

  // Para compatibilidad con el código existente
  public resumen = computed(() => this.mostrandoResumenNueva());
  public mostrarJugadores = computed(() => this.mostrandoJugadores());
  public mostrarDetalles = computed(() => this.mostrandoDetalles());

  public fecha = this._fecha.asReadonly();
  public modalAbierta = this._modalAbierta.asReadonly();
  public abiertaDesdeMisReservas = this._abiertaDesdeMisReservas.asReadonly();

  allEspaciosQuery = injectQuery(() => ({
    queryKey: [
      'espacios',
      'all',
      this._fecha(),
      this._idGrupo(),
      this._idSede(),
      this._idCategoria(),
    ],
    queryFn: () =>
      getEspaciosAll(this.http, {
        fecha: this._fecha(),
        idGrupo: this._idGrupo(),
        idSede: this._idSede(),
        idCategoria: this._idCategoria(),
      }),
    select: (response: GeneralResponse<EspacioReservas[]>) => response.data,
    enabled: computed(() => this._fecha() !== null),
  }));

  espacioDetallesQuery = injectQuery(() => ({
    queryKey: ['rvespacio', 'detalles', this._idEspacio(), this._fecha()],
    queryFn: () =>
      getEspacioDetalles(this.http, this._idEspacio(), this._fecha()),
    select: (response: GeneralResponse<ReservaEspaciosDetalles>) =>
      response.data,
    disabled: !this._idEspacio(),
  }));

  miReservaQuery = injectQuery(() => ({
    queryKey: ['rvespacio', 'miReserva', this._idMiReserva()],
    queryFn: () => getMiReserva(this.http, this._idMiReserva()),
    select: (response: GeneralResponse<ResumenReserva>) => response.data,
    enabled: !!this._idMiReserva(),
    staleTime: 0,
  }));

  jugadoresQuery = injectQuery(() => ({
    queryKey: ['jugadores', 'buscar', this._termino_busqueda_jugadores()],
    queryFn: () =>
      buscarJugadores(
        this.http,
        this._termino_busqueda_jugadores(),
        this.espacioDetallesQuery.data()?.permite_externos,
      ),
    select: (response: GeneralResponse<Usuario[]>) => response.data,
    enabled: computed(
      () =>
        this._estadoModal() === EstadoModal.AGREGAR_JUGADORES &&
        this._termino_busqueda_jugadores().trim().length > 0,
    ),
    staleTime: 30 * 1000,
  }));

  elementosQuery = injectQuery(() => ({
    queryKey: ['elementos', 'buscar', this._termino_busqueda_elementos()],
    queryFn: () =>
      buscarElementos(
        this.http,
        this._termino_busqueda_elementos(),
        this._idEspacio(),
      ),
    select: (response: any) => response.data,
    enabled: computed(
      () =>
        this._estadoModal() === EstadoModal.AGREGAR_DETALLES &&
        this._termino_busqueda_elementos().trim().length > 0,
    ),
    staleTime: 30 * 1000,
  }));

  public setFecha(fecha: string | null) {
    this._fecha.set(fecha);
  }

  public setIdGrupo(idGrupo: number | null) {
    this._idGrupo.set(idGrupo);
  }

  public setIdSede(idSede: number | null) {
    this._idSede.set(idSede);
  }

  public setIdCategoria(idCategoria: number | null) {
    this._idCategoria.set(idCategoria);
  }

  public setFiltros(filtros: {
    fecha?: string | null;
    idGrupo?: number | null;
    idSede?: number | null;
    idCategoria?: number | null;
  }) {
    if (filtros.fecha !== undefined) this._fecha.set(filtros.fecha);
    if (filtros.idGrupo !== undefined) this._idGrupo.set(filtros.idGrupo);
    if (filtros.idSede !== undefined) this._idSede.set(filtros.idSede);
    if (filtros.idCategoria !== undefined)
      this._idCategoria.set(filtros.idCategoria);
  }

  public limpiarFiltros() {
    this._fecha.set(null);
    this._idGrupo.set(null);
    this._idSede.set(null);
    this._idCategoria.set(null);
  }

  public limpiarFecha() {
    this._fecha.set(null);
  }

  public limpiarUbicacion() {
    this._idSede.set(null);
  }

  public limpiarCategoria() {
    this._idCategoria.set(null);
  }

  public limpiarGrupo() {
    this._idGrupo.set(null);
  }

  public setIdEspacio(idEspacio: number | null) {
    this._idEspacio.set(idEspacio);
  }

  public abrirModal(desdeMisReservas: boolean = false) {
    this._modalAbierta.set(true);
    this._abiertaDesdeMisReservas.set(desdeMisReservas);
  }

  public async cerrarModal() {
    this._modalAbierta.set(false);
    await new Promise(resolve => setTimeout(resolve, 300));
    this._idEspacio.set(null);
    this._estadoModal.set(EstadoModal.DISPONIBILIDAD);
    this._mensajeCargando.set('');
    this._estadoResumen.set(null);
    this._miReserva.set(null);
    this._idMiReserva.set(null);
    this._termino_busqueda_jugadores.set('');
    this._jugadoresSeleccionados.set([]);
    this._detallesSeleccionados.set([]);
    this._termino_busqueda_elementos.set('');
    this._requiere_reconfirmacion.set(false);
    this._abiertaDesdeMisReservas.set(false);
  }

  public setCargando(): void;
  public setCargando(mensaje: string): void;
  public setCargando(cargando: boolean): void;
  public setCargando(param?: string | boolean) {
    if (typeof param === 'boolean') {
      if (param) {
        this._mensajeCargando.set('Cargando...');
        this._estadoModal.set(EstadoModal.CARGANDO);
      } else {
        this.setMostrarDisponibilidad();
      }
    } else {
      this._mensajeCargando.set(param || 'Cargando...');
      this._estadoModal.set(EstadoModal.CARGANDO);
    }
  }

  public setMostrarDisponibilidad() {
    this._estadoModal.set(EstadoModal.DISPONIBILIDAD);
    this._mensajeCargando.set('');
    this.espacioDetallesQuery.refetch();
  }

  public setMostrarResumenNueva(resumen: ResumenReserva) {
    this._estadoResumen.set(resumen);
    this._miReserva.set(null);
    this._estadoModal.set(EstadoModal.RESUMEN_NUEVA);
    this._mensajeCargando.set('');
  }

  public setMostrarResumenExistente(reserva: ResumenReserva) {
    this._miReserva.set(reserva);
    this._estadoResumen.set(null);
    this._estadoModal.set(EstadoModal.RESUMEN_EXISTENTE);
    this._mensajeCargando.set('');
    this._requiere_reconfirmacion.set(false);
  }

  public setMostrarJugadores() {
    this._estadoModal.set(EstadoModal.AGREGAR_JUGADORES);
    this._termino_busqueda_jugadores.set('');
    this._jugadoresSeleccionados.set([]);
    this._mensajeCargando.set('');
  }

  public setMostrarDetalles() {
    this._estadoModal.set(EstadoModal.AGREGAR_DETALLES);
    this._termino_busqueda_elementos.set('');
    this._mensajeCargando.set('');
  }

  public setProcesandoPago() {
    this._mensajeCargando.set('Procesando pago...');
    this._estadoModal.set(EstadoModal.PROCESANDO_PAGO);
  }

  public setCancelandoReserva() {
    this._mensajeCargando.set('Cancelando reserva...');
    this._estadoModal.set(EstadoModal.CANCELANDO_RESERVA);
  }

  public setResumen(resumen: boolean) {
    if (!resumen) {
      this.setMostrarDisponibilidad();
    }
  }

  public setPago(pago: boolean) {
    if (pago) {
      this.setProcesandoPago();
    }
  }

  public iniciarReserva(
    base: ReservaEspaciosDetalles,
    fechaBase: string,
    horaInicio: string,
    horaFin: string,
  ) {
    return iniciarReserva(this.http, {
      base,
      fecha: fechaBase,
      horaInicio,
      horaFin,
    });
  }

  public setEstadoResumen(resumen: ResumenReserva | null) {
    if (resumen) {
      this.setMostrarResumenNueva(resumen);
    } else {
      this._estadoResumen.set(null);
    }
  }

  public setMiReserva(reserva: ResumenReserva | null) {
    if (reserva) {
      this.setMostrarResumenExistente(reserva);
    } else {
      this._miReserva.set(null);
    }
  }

  public setIdMiReserva(idReserva: number | null) {
    if (this._idMiReserva() !== idReserva) {
      this._miReserva.set(null);
    }
    this._idMiReserva.set(idReserva);
  }

  public pagarReserva(idReserva: number) {
    return pagarReserva(this.http, idReserva);
  }

  public pagarReservaConSaldo(idReserva: number) {
    return pagarReservaConSaldo(this.http, idReserva);
  }

  public cancelarReserva(idReserva: number) {
    return eliminarReservaAction(this.http, idReserva);
  }

  public setTerminoBusquedaJugadores(termino: string) {
    this._termino_busqueda_jugadores.set(termino);
  }

  public agregarJugadorSeleccionado(jugador: Usuario) {
    const jugadoresActuales = this._jugadoresSeleccionados();
    if (!jugadoresActuales.some(j => j.id === jugador.id)) {
      this._jugadoresSeleccionados.set([...jugadoresActuales, jugador]);
    }
  }

  public removerJugadorSeleccionado(jugadorId: number) {
    const jugadoresActuales = this._jugadoresSeleccionados();
    this._jugadoresSeleccionados.set(
      jugadoresActuales.filter(j => j.id !== jugadorId),
    );
  }

  public limpiarJugadoresSeleccionados() {
    this._jugadoresSeleccionados.set([]);
  }

  public setTerminoBusquedaElementos(termino: string) {
    this._termino_busqueda_elementos.set(termino);
  }
  // -------- Elementos: manejo local (antes "detalles") --------
  public agregarElemento(el: Elemento, cantidad: number = 1) {
    if (!el) return;
    const actuales = this._detallesSeleccionados();
    const idx = actuales.findIndex(e => e.id === el.id);
    if (idx >= 0) {
      const previo = actuales[idx];
      const actualizado: Elemento = {
        ...previo,
        cantidad_seleccionada:
          (previo.cantidad_seleccionada ?? 0) + Math.max(1, cantidad),
      };
      const nuevos = [...actuales];
      nuevos[idx] = actualizado;
      this._detallesSeleccionados.set(nuevos);
    } else {
      const nuevo: Elemento = {
        ...el,
        cantidad_seleccionada:
          (el.cantidad_seleccionada ?? 0) + Math.max(1, cantidad),
      };
      this._detallesSeleccionados.set([...actuales, nuevo]);
    }
  }

  public removerElemento(index: number) {
    const actuales = this._detallesSeleccionados();
    this._detallesSeleccionados.set(actuales.filter((_, i) => i !== index));
  }

  public limpiarDetallesSeleccionados() {
    this._detallesSeleccionados.set([]);
  }

  public confirmarAgregarDetallesLocal() {
    const resumen = this._estadoResumen();
    if (!resumen) return;

    const existentes = resumen.detalles || [];
    const nuevos = this._detallesSeleccionados();
    const mapa = new Map<number, Elemento>();
    for (const e of existentes) mapa.set(e.id, e);
    for (const n of nuevos) {
      const prev = mapa.get(n.id);
      if (prev) {
        mapa.set(n.id, {
          ...prev,
          cantidad_seleccionada:
            (prev.cantidad_seleccionada ?? 0) + (n.cantidad_seleccionada ?? 0),
        });
      } else {
        mapa.set(n.id, n);
      }
    }
    const combinados = Array.from(mapa.values());

    const actualizado = {
      ...resumen,
      detalles: combinados,
    } as typeof resumen;

    this._estadoResumen.set(actualizado);
    this.limpiarDetallesSeleccionados();
  }

  public async confirmarAgregarDetallesLocalEnExistente() {
    const reserva = this._miReserva();
    if (!reserva) return;

    const existentes = reserva.detalles || [];
    const nuevos = this._detallesSeleccionados();
    const mapa = new Map<number, Elemento>();
    for (const e of existentes) mapa.set(e.id, e);
    for (const n of nuevos) {
      const prev = mapa.get(n.id);
      if (prev) {
        mapa.set(n.id, {
          ...prev,
          cantidad_seleccionada:
            (prev.cantidad_seleccionada ?? 0) + (n.cantidad_seleccionada ?? 0),
        });
      } else {
        mapa.set(n.id, n);
      }
    }
    const combinados = Array.from(mapa.values());

    const actualizado = {
      ...reserva,
      detalles: combinados,
    } as typeof reserva;

    this._miReserva.set(actualizado);
    this.limpiarDetallesSeleccionados();

    await new Promise(resolve => setTimeout(resolve, 100));
    this._requiere_reconfirmacion.set(true);
  }

  public confirmarAgregarJugadoresLocal() {
    const resumen = this._estadoResumen();
    if (!resumen) return;

    const jugadoresActuales = resumen.jugadores || [];
    const nuevos = this._jugadoresSeleccionados();
    const combinados = [
      ...jugadoresActuales,
      ...nuevos.filter(n => !jugadoresActuales.some(j => j.id === n.id)),
    ];

    const actualizado = {
      ...resumen,
      jugadores: combinados,
      total_jugadores: combinados.length,
    } as typeof resumen;

    this._estadoResumen.set(actualizado);
    this._jugadoresSeleccionados.set([]);
  }

  public confirmarAgregarJugadoresLocalEnExistente() {
    const reserva = this._miReserva();
    if (!reserva) return;

    const jugadoresActuales = reserva.jugadores || [];
    const nuevos = this._jugadoresSeleccionados();
    const combinados = [
      ...jugadoresActuales,
      ...nuevos.filter(n => !jugadoresActuales.some(j => j.id === n.id)),
    ];

    const actualizado = {
      ...reserva,
      jugadores: combinados,
      total_jugadores: combinados.length,
    } as typeof reserva;

    this._miReserva.set(actualizado);
    this._jugadoresSeleccionados.set([]);
    // Marcar que hay cambios locales pendientes de reconfirmación
    this._requiere_reconfirmacion.set(true);
  }

  public async confirmarReservaFinal(): Promise<
    number | GeneralResponse<ResumenReserva>
  > {
    const estado = this.estadoResumen() || this.miReserva();
    // Si ya hay id, solo reconfirmar si hay cambios locales
    if (estado!.id && !this._requiere_reconfirmacion()) {
      return estado!.id as number;
    }

    const response = await confirmarReserva(this.http, {
      ...estado!,
      id_espacio: this._idEspacio()!,
    });

    if (response.data) {
      this._estadoResumen.set(null);
      this.setMostrarResumenExistente(response.data);
      this._requiere_reconfirmacion.set(false);
    }

    return response;
  }

  public puedeAgregarMasJugadores(): boolean {
    const estado = this._estadoResumen() || this._miReserva();
    if (!estado) return false;
    if (!estado.puede_agregar_jugadores) return false;

    const jugadoresActuales = estado.total_jugadores || 0;
    const jugadoresSeleccionados = this._jugadoresSeleccionados().length;
    const totalFinal = jugadoresActuales + jugadoresSeleccionados;
    const maxOtros = Math.max(0, (estado.maximo_jugadores || 0) - 1);
    return totalFinal < maxOtros;
  }

  public puedeSeleccionarJugador(jugadorId?: number): boolean {
    const estado = this._estadoResumen() || this._miReserva();
    if (!estado) return false;

    if (
      jugadorId &&
      this._jugadoresSeleccionados().some(j => j.id === jugadorId)
    ) {
      return false;
    }

    if (jugadorId && (estado.jugadores || []).some(j => j.id === jugadorId)) {
      return false;
    }

    const jugadoresActuales = estado.total_jugadores || 0;
    const jugadoresSeleccionados = this._jugadoresSeleccionados().length;
    const totalFinal = jugadoresActuales + jugadoresSeleccionados;
    const maxOtros = Math.max(0, (estado.maximo_jugadores || 0) - 1);

    return totalFinal + 1 <= maxOtros;
  }

  public obtenerLimiteJugadores(): {
    actual: number;
    minimo: number;
    maximo: number;
    totalFinal: number;
  } {
    const estado = this._estadoResumen() || this._miReserva();
    if (!estado) return { actual: 0, minimo: 0, maximo: 0, totalFinal: 0 };

    const jugadoresActuales = estado.total_jugadores || 0;
    const jugadoresSeleccionados = this._jugadoresSeleccionados().length;
    const totalFinal = jugadoresActuales + jugadoresSeleccionados;

    const minOtros = Math.max(0, (estado.minimo_jugadores || 0) - 1);
    const maxOtros = Math.max(0, (estado.maximo_jugadores || 0) - 1);

    return {
      actual: jugadoresActuales,
      minimo: minOtros,
      maximo: maxOtros,
      totalFinal,
    };
  }

  public validarAgregarJugadores(): { esValido: boolean; mensaje: string } {
    const estado = this._estadoResumen() || this._miReserva();
    if (!estado) {
      return {
        esValido: false,
        mensaje: 'No se encontró información de la reserva',
      };
    }

    const jugadoresSeleccionados = this._jugadoresSeleccionados().length;
    if (jugadoresSeleccionados === 0) {
      return {
        esValido: false,
        mensaje: 'Debe seleccionar al menos un jugador',
      };
    }

    const limites = this.obtenerLimiteJugadores();

    if (limites.totalFinal > limites.maximo) {
      const disponibles = limites.maximo - limites.actual;
      return {
        esValido: false,
        mensaje: `Solo puedes agregar ${disponibles} jugador(es) más. Máximo permitido: ${limites.maximo}`,
      };
    }

    return { esValido: true, mensaje: '' };
  }

  public async agregarJugadores(idReserva: number) {
    const jugadoresIds = this._jugadoresSeleccionados().map(j => j.id);
    return agregarJugadoresReserva(this.http, idReserva, jugadoresIds);
  }

  public async pagarMensualidad() {
    const espacio = this.espacioDetallesQuery.data();

    if (espacio) {
      return pagarMensualidad(this.http, espacio.id);
    }

    throw new Error('No se encontró información del espacio');
  }
}
