import { Usuario } from '../intefaces';
import { environment } from '@environments/environment';
import { SaveUsuarioResponse } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const saveUsuario = async (
  usuario: Usuario,
  update: boolean = false,
  fromDashboard: boolean = false,
): Promise<SaveUsuarioResponse> => {
  try {
    usuario.rol = '';
    const response = await fetch(
      `${BASE_URL}/usuarios${fromDashboard ? '/dsbd' : ''}${
        update ? `/${usuario.id}` : ''
      }`,
      {
        method: update ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      },
    );

    const data = await response.json();

    if (!data.status || data.status !== 'success') {
      throw {
        status: 'error',
        message: 'Error al guardar el usuario',
        errors: data.errors || [],
      };
    }

    return data;
  } catch (error) {
    console.error('Error in saveUsuario action:', error);
    throw error;
  }
};
