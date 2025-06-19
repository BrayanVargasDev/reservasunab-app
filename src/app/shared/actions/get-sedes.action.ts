import { environment } from '@environments/environment';
import { type Sede } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getSedes = async (): Promise<Sede[]> => {
  try {
    const response = await fetch(`${BASE_URL}/sedes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const sedes: Sede[] = data;
    return sedes;
  } catch (error) {
    console.error('Error in getSedes action:', error);
    throw error;
  }
};
