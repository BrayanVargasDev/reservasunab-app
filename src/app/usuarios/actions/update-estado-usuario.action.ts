import { environment } from '@environments/environment';
import { Usuario } from '@usuarios/intefaces';

const BASE_URL = environment.apiUrl;

export const updateUsuarioEstado = async (
  usuarioId: number,
  nuevoEstado: string,
): Promise<Usuario> => {
  try {
    if (!['activo', 'inactivo'].includes(nuevoEstado)) {
      throw new Error('El estado debe ser "activo" o "inactivo".');
    }

    let url = `${BASE_URL}/usuarios/`;

    url += nuevoEstado === 'activo' ? `${usuarioId}/restaurar` : `${usuarioId}`;

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
    console.error('Error in updateUsuarioEstado action:', error);
    throw error;
  }
};
