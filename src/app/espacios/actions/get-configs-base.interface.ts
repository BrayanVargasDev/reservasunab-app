import { PaginationState } from '@tanstack/angular-table';
import { environment } from '@environments/environment';
import { type Espacio, type Configuracion } from '../interfaces';
import { GeneralResponse, Meta } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getConfigsBase = async (
  idEspacio: number | null,
): Promise<GeneralResponse<Configuracion[]>> => {
  const url = `${BASE_URL}/espacios/configuracion-base${
    idEspacio ? `?id_espacio=${idEspacio}` : ''
  }`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getConfigsBase action:', error);
    throw error;
  }
};
