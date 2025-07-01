import { Rol } from '@permisos/interfaces';
import { UsuarioLogueado } from './usuario-logueado.interface';

export interface LoginResponse {
  status: 'success' | 'error';
  message?: string;
  user?: UsuarioLogueado;
}
