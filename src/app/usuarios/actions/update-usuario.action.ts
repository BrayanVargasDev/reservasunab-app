import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Usuario } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const updateUsuarioRol = async (
  http: HttpClient,
  usuarioId: number,
  nuevoRol: number,
): Promise<Usuario> => {
  const response = await firstValueFrom(
    http.patch<{ data: Usuario }>(`${BASE_URL}/usuarios/${usuarioId}`, { rol: nuevoRol })
  );

  return response.data;
};
