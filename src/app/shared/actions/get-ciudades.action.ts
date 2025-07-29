import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Ciudad } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getCiudades = async (
  http: HttpClient,
): Promise<GeneralResponse<Ciudad[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<Ciudad[]>>(`${BASE_URL}/ciudades`),
  );
};
