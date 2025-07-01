import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Espacio } from '@espacios/interfaces';

const BASE_URL = environment.apiUrl;

export const updateEspacioEstado = async (
  http: HttpClient,
  espacioId: number,
  nuevoEstado: string,
): Promise<Espacio> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/espacios/`;
  url += nuevoEstado === 'activo' ? `${espacioId}/restaurar` : `${espacioId}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Espacio }>(url, body)
      : http.delete<{ data: Espacio }>(url, { body })
  );

  return response.data;
};
