import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { getYear } from 'date-fns';

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

  private _anioSeleccionado = signal<number>(0);

  constructor() {
    this._anioSeleccionado.set(getYear(new Date()));
  }

  // Consulta para reservas por mes con refetch automático cada 1 minuto
  public reservasPorMesQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'reservas-por-mes', this._anioSeleccionado()],
    queryFn: () => getReservasPorMes(this.http, this._anioSeleccionado()),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<ReservasPorMes[]>) => response.data,
  }));

  // Consulta para promedio por horas con refetch automático cada 1 minuto
  public promedioPorHorasQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'promedio-por-horas'],
    queryFn: () => getPromedioPorHoras(this.http),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<PromedioPorHoras[]>) => response.data,
  }));

  // Consulta para reservas por categoría con refetch automático cada 1 minuto
  public reservasPorCategoriaQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'reservas-por-categoria'],
    queryFn: () => getReservasPorCategoria(this.http),
    refetchInterval: 60000, // 1 minuto
    select: (response: GeneralResponse<ReservasPorCategoria[]>) =>
      response.data,
  }));

  // Consulta para recaudo mensual con refetch automático cada 1 minuto
  public recaudoMensualQuery = injectQuery(() => ({
    queryKey: ['dashboard', 'recaudo-mensual'],
    queryFn: () => getRecaudoMensual(this.http),
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

  public anioSeleccionado = computed(() => this._anioSeleccionado());

  public setAnioSeleccionado(anio: number) {
    this._anioSeleccionado.set(anio);
  }
}
