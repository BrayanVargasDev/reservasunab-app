import { LoginResponse } from '@auth/interfaces';
import { CredencialesLogin } from '@auth/interfaces/credenciales-login.interface';

export interface HttpClient {
  post<T>(url: string, data: any): Promise<T>;
}

export class LoginAction {
  constructor(private httpClient: HttpClient) {}

  async execute(credentials: CredencialesLogin): Promise<LoginResponse> {
    try {
      const response = await this.httpClient.post<LoginResponse>(
        '/api/auth/login',
        credentials,
      );
      return response;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
}
