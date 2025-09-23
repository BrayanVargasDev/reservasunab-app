import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { getYear, getMonth } from 'date-fns';

import {
  getReservasPorMes,
  getPromedioPorHoras,
  getReservasPorCategoria,
  getRecaudoMensual,
  getIndicadores,
  getAniosReservas,
} from '../actions';
import {
  ReservasPorMes,
  PromedioPorHoras,
  ReservasPorCategoria,
  RecaudoMensual,
  GeneralResponse,
} from '@shared/interfaces';
import { Indicadores } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  private _anioReservasPorMes = signal<number>(0);
  private _anioRecaudoMensual = signal<number>(0);
  private _mesPromedioHoras = signal<number>(0);
  private _mesReservasCategoria = signal<number>(0);

  constructor() {
    const anioActual = getYear(new Date());
    this._anioReservasPorMes.set(anioActual);
    this._anioRecaudoMensual.set(anioActual);
    this._mesPromedioHoras.set(getMonth(new Date()) + 1); // getMonth returns 0-11, so add 1
    this._mesReservasCategoria.set(getMonth(new Date()) + 1); // getMonth returns 0-11, so add 1
  }

  // Consulta para reservas por mes con refetch automático cada 1 minuto
  public reservasPorMesQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'reservas-por-mes', this._anioReservasPorMes()],
    queryFn: () => getReservasPorMes(this.http, this._anioReservasPorMes()),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<ReservasPorMes[]>) => response.data,
  }));

  // Consulta para promedio por horas con refetch automático cada 1 minuto
  public promedioPorHorasQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'promedio-por-horas', this._mesPromedioHoras()],
    queryFn: () => getPromedioPorHoras(this.http, undefined, this._mesPromedioHoras()),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<PromedioPorHoras[]>) => response.data,
  }));

  // Consulta para reservas por categoría con refetch automático cada 1 minuto
  public reservasPorCategoriaQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'reservas-por-categoria', this._mesReservasCategoria()],
    queryFn: () => getReservasPorCategoria(this.http, undefined, this._mesReservasCategoria()),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<ReservasPorCategoria[]>) =>
      response.data,
  }));

  // Consulta para recaudo mensual con refetch automático cada 1 minuto
  public recaudoMensualQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'recaudo-mensual', this._anioRecaudoMensual()],
    queryFn: () => getRecaudoMensual(this.http, this._anioRecaudoMensual()),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<RecaudoMensual[]>) => response.data,
  }));

  public indicadoresQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'indicadores'],
    queryFn: () => getIndicadores(this.http),
    refetchInterval: 60 * 1000 * 3, // 3 minutos
    select: (response: GeneralResponse<Indicadores>) => response.data,
  }));

  public aniosConReservasQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'anios-con-reservas'],
    queryFn: () => getAniosReservas(this.http),
    staleTime: Infinity,
    select: (response: GeneralResponse<number[]>) => response.data,
  }));

  public anioReservasPorMes = computed(() => this._anioReservasPorMes());
  public anioRecaudoMensual = computed(() => this._anioRecaudoMensual());
  public mesPromedioHoras = computed(() => this._mesPromedioHoras());
  public mesReservasCategoria = computed(() => this._mesReservasCategoria());

  public setAnioReservasPorMes(anio: number) {
    this._anioReservasPorMes.set(anio);
  }

  public setAnioRecaudoMensual(anio: number) {
    this._anioRecaudoMensual.set(anio);
  }

  public setMesPromedioHoras(mes: number) {
    this._mesPromedioHoras.set(mes);
  }

  public setMesReservasCategoria(mes: number) {
    this._mesReservasCategoria.set(mes);
  }
}
