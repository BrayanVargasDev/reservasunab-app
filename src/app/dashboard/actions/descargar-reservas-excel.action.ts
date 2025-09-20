import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const descargarReservasExcel = async (
  http: HttpClient,
  mes: number,
  anio?: number,
): Promise<Blob> => {
  let params = new HttpParams();

  params = params.append('mes', mes.toString());

  if (anio) {
    params = params.append('anio', anio.toString());
  }

  return firstValueFrom(
    http.get(`${BASE_URL}/dashboard/descargar-reservas-excel`, {
      params,
      responseType: 'blob',
    }),
  );
};
