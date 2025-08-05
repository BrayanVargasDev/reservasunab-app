import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const API = `${environment.apiUrl}/usuarios`;

export const checkTermsAccepted = (http: HttpClient) =>
  firstValueFrom(
    http.get<GeneralResponse<{ terminos_condiciones: boolean }>>(
      `${API}/terminos-condiciones`,
    ),
  );

export const acceptTerms = (http: HttpClient) =>
  firstValueFrom(
    http.post<GeneralResponse<{ success: boolean }>>(
      `${API}/terminos-condiciones`,
      {},
    ),
  );

export const checkProfileCompleted = (http: HttpClient) =>
  firstValueFrom(
    http.get<GeneralResponse<{ perfil_completo: boolean }>>(
      `${API}/perfil-completo`,
    ),
  );
