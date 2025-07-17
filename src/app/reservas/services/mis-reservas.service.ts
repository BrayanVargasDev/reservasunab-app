import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { injectQuery } from '@tanstack/angular-query-experimental';

import { AuthService } from '@auth/services/auth.service';
import { getMisReservas } from '../actions/get-mis-reservas.action';
import { PaginatedResponse } from '@shared/interfaces/paginatd-response.interface';
import { Reserva } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MisReservasService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  misReservasQuery = injectQuery(() => ({
    queryKey: ['misReservas'],
    queryFn: () => getMisReservas(this.http),
    select: (response: PaginatedResponse<Reserva>) => response.data,
  }));
}
