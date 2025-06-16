import { environment } from '@environments/environment';
import { type RolPermisos, type Permiso } from '../interfaces';
import { CreateRolRequest } from '../interfaces/create-rol.interface';

const BASE_URL = `${environment.apiUrl}/roles`;

export const actualizarRol = async (
  id: number,
  rol: CreateRolRequest,
): Promise<RolPermisos> => {
  const url = `${BASE_URL}/${id}`;

  console.log('Updating role with ID:', id, 'and data:', rol);

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rol),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in actualizarRol action:', error);
    throw error;
  }
};
