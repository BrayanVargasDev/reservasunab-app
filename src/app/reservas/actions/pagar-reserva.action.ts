import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const pagarReserva = async (
  http: HttpClient,
  id_reserva: number,
  origen: 'app' | 'web',
): Promise<GeneralResponse<string>> => {
  const url = `${BASE_URL}/pagos/reservas`;

  return firstValueFrom(
    http.post<GeneralResponse<string>>(
      url,
      {
        id_reserva: id_reserva,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          origen: origen,
        },
      },
    ),
  );
};
