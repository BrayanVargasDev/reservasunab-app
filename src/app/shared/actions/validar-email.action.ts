import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

export const validarEmailTomado = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/validate-email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const emailTomado: boolean = data;
    return emailTomado;
  } catch (error) {
    console.error('Error in validarEmailTomado action:', error);
    throw error;
  }
};
