import { environment } from '@environments/environment';
import { type FormEspacio, type Espacio } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createEspacio = async (
  params: FormEspacio,
): Promise<GeneralResponse<Espacio>> => {
  const url = `${BASE_URL}/espacios`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createEspacio action:', error);
    throw error;
  }
};
