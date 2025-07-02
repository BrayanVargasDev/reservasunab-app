import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Usuario } from '@usuarios/intefaces';

const BASE_URL = environment.apiUrl;

export const getPerfil = async (
  http: HttpClient,
  id: number,
): Promise<GeneralResponse<Usuario>> => {
  const url = `${BASE_URL}/usuarios/${id}`;

  return firstValueFrom(http.get<GeneralResponse<Usuario>>(url));
};
