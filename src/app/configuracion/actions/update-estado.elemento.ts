import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Elemento } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateEstadoElemento = async (
  http: HttpClient,
  idConfig: number,
  nuevoEstado: string,
): Promise<Elemento> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/elementos/`;
  url += nuevoEstado === 'activo' ? `${idConfig}/restaurar` : `${idConfig}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Elemento }>(url, body)
      : http.delete<{ data: Elemento }>(url, { body }),
  );

  return response.data;
};
