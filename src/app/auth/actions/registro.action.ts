import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { CredencialesLogin, Registro } from '@auth/interfaces';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';

const BASE_URL = environment.apiUrl;

export async function registroAction(
  http: HttpClient,
  credentials: Registro,
): Promise<GeneralResponse<UsuarioLogueado>> {
  return firstValueFrom(
    http.post<GeneralResponse<UsuarioLogueado>>(
      `${BASE_URL}/registrar`,
      credentials,
    ),
  );
}
