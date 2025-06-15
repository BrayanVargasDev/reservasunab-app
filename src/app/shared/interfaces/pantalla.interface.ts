import { Permiso } from '@permisos/interfaces/permiso.interface';

export interface Pantalla {
  nombre: string;
  icono: string;
  id_pantalla: number;
  visible: boolean;
  orden: number;
  ruta: string;
  permisos: Permiso[];
}
