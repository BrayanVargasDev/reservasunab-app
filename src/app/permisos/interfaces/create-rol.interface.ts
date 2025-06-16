import { Permiso } from './permiso.interface';

export interface CreateRolRequest {
  id?: number;
  nombre: string;
  descripcion: string;
  permisos: Permiso[];
}
