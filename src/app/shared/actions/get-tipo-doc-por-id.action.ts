import { environment } from '@environments/environment';
import { type TipoDocumento } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getTipoDocPorId = async (id: string): Promise<TipoDocumento> => {
  try {
    const response = await fetch(`${BASE_URL}/tipo-doc/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const tipoDocumento: TipoDocumento = data;
    return tipoDocumento;
  } catch (error) {
    console.error('Error in getTipoDocPorId action:', error);
    throw error;
  }
};
