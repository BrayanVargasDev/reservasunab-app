import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { CredencialesLogin } from '@auth/interfaces/credenciales-login.interface';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';

const API_URL = environment.apiUrl;

export async function intercambiarTokenAction(
  http: HttpClient,
  code: string,
): Promise<GeneralResponse<UsuarioLogueado>> {
  return firstValueFrom(
    http.post<GeneralResponse<UsuarioLogueado>>(`${API_URL}/intercambiar`, {
      codigo: code,
    }),
  );
}
