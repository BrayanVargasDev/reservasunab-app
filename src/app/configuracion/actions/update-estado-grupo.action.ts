import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Grupo } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateEstadoGrupo = async (
  http: HttpClient,
  idGrupo: number,
  nuevoEstado: string,
): Promise<Grupo> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/grupos/`;
  url += nuevoEstado === 'activo' ? `${idGrupo}/restaurar` : `${idGrupo}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Grupo }>(url, body)
      : http.delete<{ data: Grupo }>(url, { body }),
  );

  return response.data;
};
