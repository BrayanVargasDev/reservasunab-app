import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Reserva } from '../interfaces';

const BASE_URL = environment.apiUrl;

// Aprueba una reserva (asumiendo endpoint REST /reservas/{id}/aprobar )
export const aprobarReserva = async (
  http: HttpClient,
  idReserva: number,
): Promise<GeneralResponse<Reserva>> => {
  const url = `${BASE_URL}/reservas/${idReserva}/aprobar`;
  return firstValueFrom(
    http.put<GeneralResponse<Reserva>>(url, null, {
      headers: { 'Content-Type': 'application/json' },
    }),
  );
};
