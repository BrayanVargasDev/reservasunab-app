import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { ResumenReserva } from '../interfaces/resumen-reserva.interface';

const BASE_URL = environment.apiUrl;

export const agregarJugadoresReserva = async (
  http: HttpClient,
  idReserva: number,
  jugadoresIds: number[],
): Promise<GeneralResponse<ResumenReserva>> => {
  const url = `${BASE_URL}/reservas/${idReserva}/agregar-jugadores`;

  return firstValueFrom(
    http.post<GeneralResponse<ResumenReserva>>(url, {
      jugadores: jugadoresIds,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
