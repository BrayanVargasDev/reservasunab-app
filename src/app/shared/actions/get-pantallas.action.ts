import { environment } from '@environments/environment';
import { type Pantalla } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getPantallas = async (): Promise<Pantalla[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pantallas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const tiposDocumentos: Pantalla[] = data;
    return tiposDocumentos;
  } catch (error) {
    console.error('Error en getPantallas action:', error);
    throw error;
  }
};
