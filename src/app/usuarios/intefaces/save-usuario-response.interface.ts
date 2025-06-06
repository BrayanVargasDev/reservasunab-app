export interface SaveUsuarioResponse {
  status: string;
  data?: any;
  message: string;
  errors: Errors;
}

export interface Errors {
  [key: string]: string[];
}
