import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type TipoDocumento } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getTipoDocPorId = async (
  http: HttpClient,
  id: string
): Promise<TipoDocumento> => {
  const response = await firstValueFrom(
    http.get<{ data: TipoDocumento }>(`${BASE_URL}/tipo-doc/${id}`)
  );
  return response.data;
};
