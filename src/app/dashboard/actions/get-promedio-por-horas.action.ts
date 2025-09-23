import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, PromedioPorHoras } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getPromedioPorHoras = async (
  http: HttpClient,
  anio?: number,
  mes?: number,
): Promise<GeneralResponse<PromedioPorHoras[]>> => {
  let params = new HttpParams();

  if (anio) {
    params = params.append('anio', anio.toString());
  }

  if (mes) {
    params = params.append('mes', mes.toString());
  }

  return firstValueFrom(
    http.get<GeneralResponse<PromedioPorHoras[]>>(
      `${BASE_URL}/dashboard/promedio-por-horas`,
      { params },
    ),
  );
};
