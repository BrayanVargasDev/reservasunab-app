import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type GeneralResponse } from '@shared/interfaces';
import { ResumenReserva, ReservaEspaciosDetalles } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const confirmarReserva = async (
  http: HttpClient,
  payload: ResumenReserva,
): Promise<GeneralResponse<ResumenReserva>> => {
  const url = `${BASE_URL}/reservas/confirmar`;

  return firstValueFrom(
    http.post<GeneralResponse<ResumenReserva>>(
      url,
      {
        ...payload,
        jugadores: payload.jugadores?.map(jugador => jugador.id),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ),
  );
};
