import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Novedad } from '../interfaces';
import { GeneralResponse, Meta } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getNovedades = async (
  http: HttpClient,
  idEspacio: number | null,
): Promise<GeneralResponse<Novedad[]>> => {
  let url = `${BASE_URL}/espacios/novedades`;
  const params: string[] = [];

  if (idEspacio) {
    params.push(`id_espacio=${idEspacio}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return firstValueFrom(
    http.get<GeneralResponse<Novedad[]>>(url)
  );
};
