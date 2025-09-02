export interface Elemento {
  id: number;
  nombre: string;
  cantidad: number;
  valor_estudiante: number;
  valor_egresado: number;
  valor_administrativo: number;
  valor_externo: number;
  id_espacio: number;
  creado_en: string;
  eliminado_en: string | null;
  actualizado_en: string | null;
  cantidad_seleccionada: number;
}
