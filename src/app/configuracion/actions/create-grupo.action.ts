import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Grupo } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createGrupo = async (
  http: HttpClient,
  params: Partial<Grupo>,
): Promise<GeneralResponse<Grupo>> => {
  const url = `${BASE_URL}/grupos`;

  return firstValueFrom(http.post<GeneralResponse<Grupo>>(url, params));
};
