import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export interface CambiarPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CambiarPasswordResponse {
  message: string;
}

export const cambiarPassword = async (
  http: HttpClient,
  datos: CambiarPasswordRequest,
): Promise<GeneralResponse<CambiarPasswordResponse>> => {
  const url = `${BASE_URL}/usuarios/cambiar-password`;

  return firstValueFrom(
    http.put<GeneralResponse<CambiarPasswordResponse>>(url, datos)
  );
};
