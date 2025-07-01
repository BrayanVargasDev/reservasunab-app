import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type FormEspacio, type Espacio } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createEspacio = async (
  http: HttpClient,
  params: FormEspacio,
): Promise<GeneralResponse<Espacio>> => {
  const url = `${BASE_URL}/espacios`;

  return firstValueFrom(
    http.post<GeneralResponse<Espacio>>(url, params)
  );
};
