import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioParaConfig } from '../interfaces/espacio-para-config.interface';

const BASE_URL = environment.apiUrl;

export const getEspacioPorId = async (
  http: HttpClient,
  id: number,
): Promise<GeneralResponse<EspacioParaConfig>> => {
  const url = `${BASE_URL}/espacios/${id}`;

  return firstValueFrom(
    http.get<GeneralResponse<EspacioParaConfig>>(url)
  );
};
