import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type CamposFacturacion } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const saveCamposFacturacion = async (
  http: HttpClient,
  campos: CamposFacturacion,
): Promise<GeneralResponse<CamposFacturacion>> => {
  const url = `${BASE_URL}/usuarios/${campos.id_usuario}`;

  return firstValueFrom(
    http.patch<GeneralResponse<CamposFacturacion>>(url, campos),
  );
};
