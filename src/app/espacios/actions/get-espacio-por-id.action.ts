import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { EspacioParaConfig } from '../interfaces/espacio-para-config.interface';

const BASE_URL = environment.apiUrl;

export const getEspacioPorId = async (
  id: number,
): Promise<GeneralResponse<EspacioParaConfig>> => {
  const url = `${BASE_URL}/espacios/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getEspacioPorId action:', error);
    throw error;
  }
};
