import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { TipoUsuarioConfig } from '../interfaces/tipo-usuario-config.interface';

const BASE_URL = environment.apiUrl;

export const updateEstadoTipoConfig = async (
  http: HttpClient,
  idConfig: number,
  nuevoEstado: string,
): Promise<TipoUsuarioConfig> => {
  if (!['activo', 'inactivo'].includes(nuevoEstado)) {
    throw new Error('El estado debe ser "activo" o "inactivo".');
  }

  let url = `${BASE_URL}/espacios/tipo_usuario_config`;
  url += nuevoEstado === 'activo' ? `${idConfig}/restaurar` : `${idConfig}`;

  const method = nuevoEstado === 'activo' ? 'PATCH' : 'DELETE';
  const body = { estado: nuevoEstado };

  const response = await firstValueFrom(
    method === 'PATCH'
      ? http.patch<{ data: TipoUsuarioConfig }>(url, body)
      : http.delete<{ data: TipoUsuarioConfig }>(url, { body })
  );

  return response.data;
};
