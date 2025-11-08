import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export interface SolicitarCodigoRequest {
  email: string;
}

export interface SolicitarCodigoResponse {
  success: boolean;
  message: string;
}

export const solicitarCodigoVerificacion = async (
  http: HttpClient,
  datos: SolicitarCodigoRequest,
): Promise<GeneralResponse<SolicitarCodigoResponse>> => {
  const url = `${BASE_URL}/usuarios/request-verification-code`;

  return firstValueFrom(
    http.post<GeneralResponse<SolicitarCodigoResponse>>(url, datos)
  );
};