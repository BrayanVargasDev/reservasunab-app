import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioReservas, ResumenReserva, IniciarReserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const iniciarReserva = async (
  http: HttpClient,
  params: IniciarReserva,
): Promise<GeneralResponse<ResumenReserva>> => {
  const url = `${BASE_URL}/dreservas`;

  return firstValueFrom(
    http.post<GeneralResponse<ResumenReserva>>(url, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
