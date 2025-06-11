export interface Menu {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  icono: string;
  url: string;
  orden: number;
  visible: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
  eliminadoEn?: Date;
}
