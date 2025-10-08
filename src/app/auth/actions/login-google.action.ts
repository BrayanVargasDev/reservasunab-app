import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';

const API_URL = environment.apiUrl;

export async function loginGoogleAction(
  http: HttpClient,
  idToken: string,
): Promise<GeneralResponse<UsuarioLogueado>> {
  return firstValueFrom(
    http.post<GeneralResponse<UsuarioLogueado>>(`${API_URL}/google/callback`, {
      idToken: idToken,
    }),
  );
}
