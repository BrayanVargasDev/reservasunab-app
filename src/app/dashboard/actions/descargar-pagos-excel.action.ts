import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

export const descargarPagosExcel = async (
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
    http.get(`${BASE_URL}/dashboard/descargar-pagos-excel`, {
      params,
      responseType: 'blob',
    }),
  );
};
