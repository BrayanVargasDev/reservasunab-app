import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Grupo } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateGrupo = async (
  http: HttpClient,
  params: Grupo,
  idGrupo: number,
): Promise<GeneralResponse<Grupo>> => {
  const url = `${BASE_URL}/grupos/${idGrupo}`;

  return firstValueFrom(http.patch<GeneralResponse<Grupo>>(url, params));
};
