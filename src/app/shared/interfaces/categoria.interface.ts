import { Grupo } from './grupo.interface';
export interface Categoria {
  id: number;
  nombre: string;
  id_grupo?: number;
  creado_en: string;
  actualizado_en: string;
  creado_por: number;
  actualizado_por: number | null;
  eliminado_por: number | null;
  eliminado_en: number | null;
  direccion?: string;
  telefono?: string;
  grupo?: Grupo;
  reservas_estudiante?: number;
  reservas_administrativo?: number;
  reservas_externo?: number;
  reservas_egresado?: number;
}
