import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, RecaudoMensual } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRecaudoMensual = async (
  http: HttpClient,
  anio?: number,
): Promise<GeneralResponse<RecaudoMensual[]>> => {
  let params = new HttpParams();

  if (anio) {
    params = params.append('anio', anio.toString());
  }

  return firstValueFrom(
    http.get<GeneralResponse<RecaudoMensual[]>>(`${BASE_URL}/dashboard/recaudo-mensual`, { params }),
  );
};
