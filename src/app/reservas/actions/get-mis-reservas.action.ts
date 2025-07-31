import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioReservas, Reserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getMisReservas = async (
  http: HttpClient,
  searchText: string = '',
): Promise<GeneralResponse<Reserva[]>> => {
  const url = `${BASE_URL}/reservas/me`;

  const params = new HttpParams().set('search', searchText);

  return firstValueFrom(
    http.get<GeneralResponse<Reserva[]>>(url, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
