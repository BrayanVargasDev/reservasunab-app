import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Reserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

// Elimina (cancela) una reserva (asumiendo endpoint DELETE /reservas/{id})
export const eliminarReserva = async (
  http: HttpClient,
  idReserva: number,
): Promise<GeneralResponse<Reserva>> => {
  const url = `${BASE_URL}/reservas/${idReserva}`;
  return firstValueFrom(
    http.delete<GeneralResponse<Reserva>>(url, {
      headers: { 'Content-Type': 'application/json' },
    }),
  );
};
