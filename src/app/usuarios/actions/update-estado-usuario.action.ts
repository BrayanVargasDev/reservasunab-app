import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Usuario } from '@usuarios/intefaces';

const BASE_URL = environment.apiUrl;

export const updateUsuarioEstado = async (
  http: HttpClient,
  usuarioId: number,
  nuevoEstado: string,
): Promise<Usuario> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/usuarios/`;
  url += nuevoEstado === 'activo' ? `${usuarioId}/restaurar` : `${usuarioId}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Usuario }>(url, body)
      : http.delete<{ data: Usuario }>(url, { body })
  );

  return response.data;
};
