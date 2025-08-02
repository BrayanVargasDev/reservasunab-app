import { Rol, Permiso } from '@permisos/interfaces';
import { TipoUsuario } from '@shared/enums';

export interface UsuarioLogueado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  token: string;
  permisos: Permiso[];
  tipo_usuario: TipoUsuario[];
}
