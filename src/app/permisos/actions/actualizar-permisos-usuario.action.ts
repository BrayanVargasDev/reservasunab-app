import { environment } from '@environments/environment';
import { type Permiso, type PermisosUsuario } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const actualizarPermisosUsuario = async (
  userId: number,
  permisos: Permiso[]
): Promise<PermisosUsuario> => {
  const url = `${BASE_URL}/usuarios/${userId}/permisos`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permisos }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in actualizarPermisosUsuario action:', error);
    throw error;
  }
};
