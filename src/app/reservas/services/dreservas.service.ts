import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getEspaciosAll, getEspacioDetalles } from '@reservas/actions';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';
import { EspacioReservas, ReservaEspaciosDetalles } from '../interfaces';

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
  }
}
