import { LoginResponse } from '@auth/interfaces';
import { CredencialesLogin } from '@auth/interfaces/credenciales-login.interface';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

export async function loginAction(
  credentials: CredencialesLogin,
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${BASE_URL}/singin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData.message;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
