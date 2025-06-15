import { Permiso } from './permiso.interface';
export interface Rol {
  id?: number;
  nombre: string | null;
  descripcion: string | null;
  creadoEn?: string;
  actualizadoEn?: Date;
  eliminadoEn?: Date;
  permisos?: Permiso[];
}
