import { Rol } from '@permisos/interfaces';

export interface UsuarioLogueado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  token: string;
}
