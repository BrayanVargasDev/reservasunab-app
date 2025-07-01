import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { getEspaciosAll } from '../actions/get-espacios-all.action';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DreservasService {
  private http = inject(HttpClient);

  allEspaciosQuery = injectQuery(() => ({
    queryKey: ['espacios', 'all'],
    queryFn: () => getEspaciosAll(this.http),
    select: (response: GeneralResponse<Espacio[]>) => response.data,
  }));
}
