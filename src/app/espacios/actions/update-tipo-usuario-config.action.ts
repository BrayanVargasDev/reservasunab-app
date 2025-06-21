import { environment } from '@environments/environment';
import { type TipoUsuarioConfig } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateTipoUsuarioConfig = async (
  params: TipoUsuarioConfig,
  idConfig: number,
): Promise<GeneralResponse<TipoUsuarioConfig>> => {
  const url = `${BASE_URL}/espacios/tipo-usuario-config/${idConfig}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
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
    console.error('Error in updateTipoUsuarioConfig action:', error);
    throw error;
  }
};
