import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Configuracion } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const saveConfigBase = async (
  http: HttpClient,
  configuracion: Configuracion,
): Promise<GeneralResponse<Configuracion>> => {
  const url = `${BASE_URL}/espacios/configuracion-base`;
  const method = configuracion.id ? 'PATCH' : 'POST';

  return firstValueFrom(
    method === 'PATCH'
      ? http.patch<GeneralResponse<Configuracion>>(url, configuracion)
      : http.post<GeneralResponse<Configuracion>>(url, configuracion)
  );
};
