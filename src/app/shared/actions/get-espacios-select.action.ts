import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Sede } from '../interfaces';
import { type GeneralResponse, type EspacioSelect } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getEspaciosSelect = async (
  http: HttpClient,
): Promise<GeneralResponse<EspacioSelect[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<EspacioSelect[]>>(`${BASE_URL}/espacios/all`),
  );
};
