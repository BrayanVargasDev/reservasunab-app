import { Permiso } from './permiso.interface';

export interface RolPermisos {
  id: number;
  nombre: string;
  descripcion: string;
  activo: null;
  creadoEn: string;
  actualizadoEn: null;
  permisos: Permiso[];
}
