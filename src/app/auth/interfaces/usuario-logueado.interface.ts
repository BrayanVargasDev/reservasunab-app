import { Rol, Permiso } from '@permisos/interfaces';
import { TipoUsuario } from '@shared/enums';

export interface UsuarioLogueado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  access_token: string;
  refresh_token: string;
  permisos: Permiso[];
  tipo_usuario: TipoUsuario[];
  saldo: number;
}
