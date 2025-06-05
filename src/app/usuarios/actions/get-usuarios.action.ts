import { environment } from '@environments/environment';
import { type Usuario } from '../intefaces';

const BASE_URL = environment.apiUrl;

export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const usuarios: Usuario[] = data;
    return usuarios;
  } catch (error) {
    console.error('Error in getUsuarios action:', error);
    throw error;
  }
};
