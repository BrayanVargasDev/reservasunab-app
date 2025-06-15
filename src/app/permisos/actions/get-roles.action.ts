import { environment } from '@environments/environment';
import { type Rol } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getRoles = async (): Promise<Rol[]> => {
  try {
    const response = await fetch(`${BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { data } = await response.json();
    const roles: Rol[] = data;
    return roles;
  } catch (error) {
    console.error('Error in getRoles action:', error);
    throw error;
  }
};
