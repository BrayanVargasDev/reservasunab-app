export interface GeneralResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: string;
  errors?: {
    [key: string]: string;
  };
}
