export interface LoginResponse {
  status: 'success' | 'error';
  message?: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
