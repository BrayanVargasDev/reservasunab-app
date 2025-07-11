import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Categoria } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateCategoria = async (
  http: HttpClient,
  params: Categoria,
  idConfig: number,
): Promise<GeneralResponse<Categoria>> => {
  const url = `${BASE_URL}/categorias/${idConfig}`;

  return firstValueFrom(http.patch<GeneralResponse<Categoria>>(url, params));
};
