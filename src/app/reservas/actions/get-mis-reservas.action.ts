import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { PaginatedResponse } from '@shared/interfaces';
import { EspacioReservas, Reserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getMisReservas = async (
  http: HttpClient,
): Promise<PaginatedResponse<Reserva>> => {
  const url = `${BASE_URL}/reservas/me`;

  return firstValueFrom(
    http.get<PaginatedResponse<Reserva>>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
