import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, ReservasPorCategoria } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getReservasPorCategoria = async (
  http: HttpClient,
  anio?: number,
  mes?: number,
): Promise<GeneralResponse<ReservasPorCategoria[]>> => {
  let params = new HttpParams();

  if (anio) {
    params = params.append('anio', anio.toString());
  }

  if (mes) {
    params = params.append('mes', mes.toString());
  }

  return firstValueFrom(
    http.get<GeneralResponse<ReservasPorCategoria[]>>(
      `${BASE_URL}/dashboard/reservas-por-categoria`,
      { params },
    ),
  );
};
