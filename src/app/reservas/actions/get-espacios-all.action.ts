import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Espacio } from '@espacios/interfaces';

const BASE_URL = environment.apiUrl;

export const getEspaciosAll = async (
  http: HttpClient
): Promise<GeneralResponse<Espacio[]>> => {
  const url = `${BASE_URL}/espacios/all`;

  return firstValueFrom(
    http.get<GeneralResponse<Espacio[]>>(url)
  );
};
