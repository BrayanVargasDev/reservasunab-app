import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Elemento } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createElemento = async (
  http: HttpClient,
  params: Partial<Elemento>,
): Promise<GeneralResponse<Elemento>> => {
  const url = `${BASE_URL}/elementos`;

  return firstValueFrom(http.post<GeneralResponse<Elemento>>(url, params));
};
