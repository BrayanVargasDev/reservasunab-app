import { Usuario } from '../intefaces';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

export const saveUsuario = async (
  usuario: Usuario,
  update: boolean = false,
  fromDashboard: boolean = false
): Promise<any> => {
  try {
    const response = await fetch(
      `${BASE_URL}/usuarios${fromDashboard ? '/dsbd' : ''}`,
      {
        method: update ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in saveUsuario action:', error);
    throw error;
  }
};
