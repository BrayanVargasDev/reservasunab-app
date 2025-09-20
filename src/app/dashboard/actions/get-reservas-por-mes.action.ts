import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, ReservasPorMes } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getReservasPorMes = async (
  http: HttpClient,
  anio?: number,
): Promise<GeneralResponse<ReservasPorMes[]>> => {
  let params = new HttpParams();

  if (anio) {
    params = params.append('anio', anio.toString());
  }

  return firstValueFrom(
    http.get<GeneralResponse<ReservasPorMes[]>>(
      `${BASE_URL}/dashboard/reservas-por-mes`,
      { params },
    ),
  );
};
