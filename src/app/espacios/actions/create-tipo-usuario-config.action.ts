import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type TipoUsuarioConfig } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createTipoUsuarioConfig = async (
  http: HttpClient,
  params: Partial<TipoUsuarioConfig>,
): Promise<GeneralResponse<TipoUsuarioConfig>> => {
  const url = `${BASE_URL}/espacios/tipo-usuario-config`;

  return firstValueFrom(
    http.post<GeneralResponse<TipoUsuarioConfig>>(url, params)
  );
};
