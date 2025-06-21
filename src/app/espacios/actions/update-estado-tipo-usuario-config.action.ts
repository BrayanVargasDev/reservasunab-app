import { environment } from '@environments/environment';
import { TipoUsuarioConfig } from '../interfaces/tipo-usuario-config.interface';

const BASE_URL = environment.apiUrl;

export const updateEstadoTipoConfig = async (
  idConfig: number,
  nuevoEstado: string,
): Promise<TipoUsuarioConfig> => {
  try {
    if (!['activo', 'inactivo'].includes(nuevoEstado)) {
      throw new Error('El estado debe ser "activo" o "inactivo".');
    }

    let url = `${BASE_URL}/espacios/tipo_usuario_config`;

    url += nuevoEstado === 'activo' ? `${idConfig}/restaurar` : `${idConfig}`;

    const response = await fetch(url, {
      method: nuevoEstado === 'activo' ? 'PATCH' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error in updateEstadoTipoConfig action:', error);
    throw error;
  }
};
