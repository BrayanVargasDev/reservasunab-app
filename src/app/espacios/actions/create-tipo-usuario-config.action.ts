import { environment } from '@environments/environment';
import { type TipoUsuarioConfig } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const createTipoUsuarioConfig = async (
  params: Partial<TipoUsuarioConfig>,
): Promise<GeneralResponse<TipoUsuarioConfig>> => {
  const url = `${BASE_URL}/espacios/tipo-usuario-config`;

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
    console.error('Error in createTipoUsuarioConfig action:', error);
    throw error;
  }
};
