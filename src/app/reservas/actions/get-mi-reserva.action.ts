import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { ResumenReserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getMiReserva = async (
  http: HttpClient,
  idReserva: number | null,
): Promise<GeneralResponse<ResumenReserva>> => {
  const url = `${BASE_URL}/reservas/mi-reserva/${idReserva}`;

  return firstValueFrom(
    http.get<GeneralResponse<ResumenReserva>>(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
