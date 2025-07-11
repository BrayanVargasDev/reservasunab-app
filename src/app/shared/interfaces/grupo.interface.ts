export interface Grupo {
  id: number;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
  creado_por: number;
  actualizado_por: number | null;
  eliminado_por: number | null;
  eliminado_en: number | null;
}
