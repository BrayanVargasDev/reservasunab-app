import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { Novedad } from '@espacios/interfaces';

const BASE_URL = environment.apiUrl;

export const eliminarNovedad = async (
  http: HttpClient,
  idConfig: number,
  nuevoEstado: string,
): Promise<Novedad> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/espacios/novedades/${idConfig}`;
  url += nuevoEstado === 'activo' ? `/restaurar` : '';

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: Novedad }>(url, body)
      : http.delete<{ data: Novedad }>(url, { body }),
  );

  return response.data;
};
