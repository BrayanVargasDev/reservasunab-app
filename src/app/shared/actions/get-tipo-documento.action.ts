import { environment } from '@environments/environment';
import { type TipoDocumento } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getTiposDocumentos = async (): Promise<TipoDocumento[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tipo-doc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const tiposDocumentos: TipoDocumento[] = data;
    return tiposDocumentos;
  } catch (error) {
    console.error('Error en getTiposDocumentos action:', error);
    throw error;
  }
};
