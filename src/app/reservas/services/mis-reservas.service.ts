import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { injectQuery } from '@tanstack/angular-query-experimental';

import { AuthService } from '@auth/services/auth.service';
import { getMisReservas } from '../actions/get-mis-reservas.action';
import { GeneralResponse } from '@shared/interfaces';
import { Reserva } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MisReservasService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private _filtroTexto = signal<string>('');

  public filtroTexto = computed(() => this._filtroTexto());

  misReservasQuery = injectQuery(() => ({
    queryKey: ['misReservas', this._filtroTexto()],
    queryFn: () => getMisReservas(this.http, this._filtroTexto()),
    select: (response: GeneralResponse<Reserva[]>) => response.data,
  }));

  public setFiltroTexto(texto: string): void {
    this._filtroTexto.set(texto);
  }

  public limpiarFiltro() {
    this._filtroTexto.set('');
  }
}
