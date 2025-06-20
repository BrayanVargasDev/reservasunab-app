import { environment } from '@environments/environment';
import { type Espacio } from '@espacios/interfaces';

const BASE_URL = environment.apiUrl;

export const updateEspacioEstado = async (
  espacioId: number,
  nuevoEstado: string,
): Promise<Espacio> => {
  try {
    if (!['activo', 'inactivo'].includes(nuevoEstado)) {
      throw new Error('El estado debe ser "activo" o "inactivo".');
    }

    let url = `${BASE_URL}/espacios/`;

    url += nuevoEstado === 'activo' ? `${espacioId}/restaurar` : `${espacioId}`;

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
    console.error('Error in updateEspacioEstado action:', error);
    throw error;
  }
};
