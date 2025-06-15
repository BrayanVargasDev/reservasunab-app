export interface Permiso {
  id_permiso: number;
  codigo: string;
  icono: null | string;
  descripcion: string;
  id_pantalla: number;
  concedido?: boolean;
}
