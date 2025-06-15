import { Permiso } from './permiso.interface';

export interface PermisosUsuario {
  id_usuario: number;
  nombre: string;
  rol: string;
  documento: string;
  esAdmin: boolean;
  permisos: Permiso[];
}
