import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioReservas, ReservaEspaciosDetalles } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getEspacioDetalles = async (
  http: HttpClient,
  idEspacio: number | null,
  fecha: string | null,
): Promise<GeneralResponse<ReservaEspaciosDetalles>> => {
  const url = `${BASE_URL}/dreservas/espacios/${idEspacio}`;

  let httpParams = new HttpParams();

  if (fecha) {
    httpParams = httpParams.append('fecha', fecha);
  }

  return firstValueFrom(
    http.get<GeneralResponse<ReservaEspaciosDetalles>>(url, {
      params: httpParams,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
