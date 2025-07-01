import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { type TipoDocumento } from '../interfaces';
import { GeneralResponse } from '../interfaces/general-response.interface';

const BASE_URL = environment.apiUrl;

export const getTiposDocumentos = async (
  http: HttpClient,
): Promise<GeneralResponse<TipoDocumento[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<TipoDocumento[]>>(`${BASE_URL}/tipo-doc`),
  );
};
