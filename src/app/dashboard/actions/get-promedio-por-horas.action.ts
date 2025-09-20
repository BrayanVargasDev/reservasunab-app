import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, PromedioPorHoras } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getPromedioPorHoras = async (
  http: HttpClient,
): Promise<GeneralResponse<PromedioPorHoras[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<PromedioPorHoras[]>>(`${BASE_URL}/dashboard/promedio-por-horas`),
  );
};
