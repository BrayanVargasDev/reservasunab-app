import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../intefaces';
import { environment } from '@environments/environment';
import { SaveUsuarioResponse } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const saveUsuario = async (
  http: HttpClient,
  usuario: Usuario,
  update: boolean = false,
  fromDashboard: boolean = false,
): Promise<SaveUsuarioResponse> => {
  usuario.rol = '';

  const url = `${BASE_URL}/usuarios${fromDashboard ? '/dsbd' : ''}${
    update ? `/${usuario.id}` : ''
  }`;

  const response = await firstValueFrom(
    update
      ? http.patch<SaveUsuarioResponse>(url, usuario)
      : http.post<SaveUsuarioResponse>(url, usuario)
  );

  if (!response.status || response.status !== 'success') {
    throw {
      status: 'error',
      message: 'Error al guardar el usuario',
      errors: response.errors || [],
    };
  }

  return response;
};
