import { environment } from '@environments/environment';
import { type Usuario } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const updateUsuarioRol = async (
  usuarioId: number,
  nuevoRol: number,
): Promise<Usuario> => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios/${usuarioId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rol: nuevoRol }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error in updateUsuarioRol action:', error);
    throw error;
  }
};
