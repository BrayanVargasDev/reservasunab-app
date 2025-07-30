export interface Novedad {
  id: number;
  id_espacio: number;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  descripcion: string;
  creado_en?: string;
  actualizado_en?: string;
  eliminado_en?: string | null;
  creado_por?: number;
  actualizado_por?: number | null;
  eliminado_por?: number | null;
}
