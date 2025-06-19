import { environment } from '@environments/environment';
import { type Sede } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getCategorias = async (): Promise<
  { id: number; nombre: string }[]
> => {
  try {
    const response = await fetch(`${BASE_URL}/categorias`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const categorias: { id: number; nombre: string }[] = data;
    return categorias;
  } catch (error) {
    console.error('Error in getCategorias action:', error);
    throw error;
  }
};
