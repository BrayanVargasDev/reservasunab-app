import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Indicadores } from '../interfaces/indicadores.interface';

const BASE_URL = environment.apiUrl;

export const getIndicadores = async (
  http: HttpClient,
): Promise<GeneralResponse<Indicadores>> => {
  return firstValueFrom(
    http.get<GeneralResponse<Indicadores>>(`${BASE_URL}/dashboard/indicadores`),
  );
};
