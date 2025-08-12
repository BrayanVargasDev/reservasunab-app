import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { PaginatedResponse } from '@shared/interfaces';
import { Reserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

// Obtiene reservas (admin) paginadas con búsqueda
export const getReservas = async (
  http: HttpClient,
  params: { pageIndex: number; pageSize: number; search?: string },
): Promise<PaginatedResponse<Reserva>> => {
  const url = `${BASE_URL}/reservas`;

  const httpParams = new HttpParams()
    .set('page', (params.pageIndex + 1).toString())
    .set('per_page', params.pageSize.toString())
    .set('search', params.search || '');

  return firstValueFrom(
    http.get<PaginatedResponse<Reserva>>(url, {
      params: httpParams,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
