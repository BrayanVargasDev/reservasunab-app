import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Categoria } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateEstadoCategoria = async (
  http: HttpClient,
  idConfig: number,
  nuevoEstado: string,
): Promise<Categoria> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/categorias/`;
  url += nuevoEstado === 'activo' ? `${idConfig}/restaurar` : `${idConfig}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Categoria }>(url, body)
      : http.delete<{ data: Categoria }>(url, { body }),
  );

  return response.data;
};
