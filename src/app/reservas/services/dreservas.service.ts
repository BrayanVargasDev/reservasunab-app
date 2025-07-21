import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getEspaciosAll, getEspacioDetalles } from '@reservas/actions';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';
import {
  EspacioReservas,
  ReservaEspaciosDetalles,
  ResumenReserva,
} from '../interfaces';
import { iniciarReserva, pagarReserva, getMiReserva } from '../actions';

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

  // ? Estado para las reservas
  private _cargando = signal(false);
  private _resumen = signal(false);
  private _pago = signal(false);
  private _estadoResumen = signal<ResumenReserva | null>(null);
  private _miReserva = signal<ResumenReserva | null>(null);
  private _idMiReserva = signal<number | null>(null);

  public cargando = computed(() => this._cargando());
  public resumen = computed(() => this._resumen());
  public pago = computed(() => this._pago());
  public estadoResumen = computed(() => this._estadoResumen());
  public miReserva = computed(() => this._miReserva());
  public idMiReserva = computed(() => this._idMiReserva());

  public fecha = this._fecha.asReadonly();

  public modalAbierta = this._modalAbierta.asReadonly();

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

  public abrirModal() {
    this._modalAbierta.set(true);
  }

  public cerrarModal() {
    this._modalAbierta.set(false);
    this._idEspacio.set(null);
    this._cargando.set(false);
    this._resumen.set(false);
    this._pago.set(false);
    this._estadoResumen.set(null);
    this._miReserva.set(null);
    this._idMiReserva.set(null);
  }

  public setCargando(cargando: boolean) {
    this._cargando.set(cargando);
  }

  public setResumen(resumen: boolean) {
    this._resumen.set(resumen);
  }

  public setPago(pago: boolean) {
    this._pago.set(pago);
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
    this._estadoResumen.set(resumen);
  }

  public setMiReserva(reserva: ResumenReserva | null) {
    this._miReserva.set(reserva);
  }

  public setIdMiReserva(idReserva: number | null) {
    this._idMiReserva.set(idReserva);
  }

  public pagarReserva(idReserva: number) {
    return pagarReserva(this.http, idReserva);
  }
}
