import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

// Pago de reserva usando saldo del usuario
export const pagarReservaConSaldo = async (
  http: HttpClient,
  id_reserva: number,
): Promise<GeneralResponse<string>> => {
  const url = `${BASE_URL}/pagos/saldos`;

  return firstValueFrom(
    http.post<GeneralResponse<string>>(
      url,
      { id_reserva },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ),
  );
};
