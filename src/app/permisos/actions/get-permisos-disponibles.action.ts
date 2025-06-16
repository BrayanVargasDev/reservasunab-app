import { environment } from '@environments/environment';
import { type Permiso } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getPermisosDisponibles = async (): Promise<Permiso[]> => {
  const url = `${BASE_URL}/permisos/disponibles`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.data || data; // Adaptar según la respuesta del backend
  } catch (error) {
    console.error('Error in getPermisosDisponibles action:', error);
    throw error;
  }
};
