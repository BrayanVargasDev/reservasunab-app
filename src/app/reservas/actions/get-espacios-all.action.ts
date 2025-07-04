import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioReservas } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getEspaciosAll = async (
  http: HttpClient,
  params: {
    fecha?: string | null;
    idGrupo?: number | null;
    idSede?: number | null;
    idCategoria?: number | null;
  },
): Promise<GeneralResponse<EspacioReservas[]>> => {
  const url = `${BASE_URL}/dreservas/espacios`;

  let httpParams = new HttpParams();

  if (params.fecha) {
    httpParams = httpParams.append('fecha', params.fecha);
  }

  if (params.idGrupo) {
    httpParams = httpParams.append('id_grupo', params.idGrupo.toString());
  }

  if (params.idSede) {
    httpParams = httpParams.append('id_sede', params.idSede.toString());
  }

  if (params.idCategoria) {
    httpParams = httpParams.append(
      'id_categoria',
      params.idCategoria.toString(),
    );
  }

  return firstValueFrom(
    http.get<GeneralResponse<EspacioReservas[]>>(url, {
      params: httpParams,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
