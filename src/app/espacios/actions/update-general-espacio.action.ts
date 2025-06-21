import { environment } from '@environments/environment';
import { type FormEspacio, type Espacio } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateGeneralEspacio = async (
  params: FormEspacio,
  idEspacio: number,
): Promise<GeneralResponse<Espacio>> => {
  const url = `${BASE_URL}/espacios/${idEspacio}`;
  let formData: FormData = new FormData();

  if (params.imagen) {
    formData.append('imagen', params.imagen);
    delete params.imagen;
  }

  formData.append('_method', 'PATCH');
  formData.append('payload', JSON.stringify(params));

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateGeneralEspacio action:', error);
    throw error;
  }
};
