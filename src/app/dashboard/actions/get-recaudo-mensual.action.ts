import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, RecaudoMensual } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRecaudoMensual = async (
  http: HttpClient,
): Promise<GeneralResponse<RecaudoMensual[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<RecaudoMensual[]>>(`${BASE_URL}/dashboard/recaudo-mensual`),
  );
};
