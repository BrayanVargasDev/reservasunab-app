import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Sede } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getCategorias = async (
  http: HttpClient,
): Promise<GeneralResponse<{ id: number; nombre: string }[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<{ id: number; nombre: string }[]>>(
      `${BASE_URL}/categorias`,
    ),
  );
};
