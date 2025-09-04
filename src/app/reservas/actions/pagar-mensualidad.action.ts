import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const pagarMensualidad = async (
  http: HttpClient,
  id_espacio: number,
): Promise<GeneralResponse<string>> => {
  const url = `${BASE_URL}/pagos/mensualidad`;

  return firstValueFrom(
    http.post<GeneralResponse<string>>(
      url,
      {
        id_espacio,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ),
  );
};
