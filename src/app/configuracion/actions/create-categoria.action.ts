import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Categoria } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createCategoria = async (
  http: HttpClient,
  params: Partial<Categoria>,
): Promise<GeneralResponse<Categoria>> => {
  const url = `${BASE_URL}/categorias`;

  return firstValueFrom(http.post<GeneralResponse<Categoria>>(url, params));
};
