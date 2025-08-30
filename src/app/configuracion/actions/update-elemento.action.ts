import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Elemento } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateElemento = async (
  http: HttpClient,
  params: Elemento,
  idConfig: number,
): Promise<GeneralResponse<Elemento>> => {
  const url = `${BASE_URL}/elementos/${idConfig}`;

  return firstValueFrom(http.patch<GeneralResponse<Elemento>>(url, params));
};
