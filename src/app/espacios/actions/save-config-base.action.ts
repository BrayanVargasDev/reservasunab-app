import { environment } from '@environments/environment';
import { type Configuracion } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const saveConfigBase = async (
  configuracion: Configuracion,
): Promise<GeneralResponse<Configuracion>> => {
  const url = `${BASE_URL}/espacios/configuracion-base`;

  try {
    const response = await fetch(url, {
      method: configuracion.id ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(configuracion),
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.error('Error in saveConfigBase action:', error);
    throw error;
  }
};
