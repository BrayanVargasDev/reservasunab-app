import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type PagoInfo, GetPagoInfoParams } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getPagoInfo = async (
  http: HttpClient,
  params: GetPagoInfoParams,
): Promise<GeneralResponse<PagoInfo>> => {
  const queryParams = new URLSearchParams({
    codigo: params.codigo,
  });

  const url = `${BASE_URL}/pagos/info?${queryParams.toString()}`;

  return firstValueFrom(http.get<GeneralResponse<PagoInfo>>(url));
};
