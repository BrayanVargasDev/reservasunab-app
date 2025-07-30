import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Novedad } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const actualizarNovedad = async (
  http: HttpClient,
  id: number,
  novedad: Partial<Novedad>,
): Promise<GeneralResponse<Novedad>> => {
  const url = `${BASE_URL}/espacios/novedades/${id}`;

  return firstValueFrom(
    http.patch<GeneralResponse<Novedad>>(url, novedad)
  );
};
