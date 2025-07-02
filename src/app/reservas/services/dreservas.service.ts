import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getEspaciosAll } from '../actions/get-espacios-all.action';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';
import { EspacioReservas } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class DreservasService {
  private http = inject(HttpClient);

  private _fecha = signal<string | null>(null);
  private _idGrupo = signal<number | null>(null);
  private _idSede = signal<number | null>(null);
  private _idCategoria = signal<number | null>(null);

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
}
