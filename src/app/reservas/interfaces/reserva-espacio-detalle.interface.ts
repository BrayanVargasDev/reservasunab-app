import { Sede, Categoria } from '@shared/interfaces';
import { Configuracion, Novedad, Imagen } from '@espacios/interfaces';

export interface ReservaEspaciosDetalles {
  id: number;
  nombre: string;
  descripcion: string;
  agregar_jugadores: boolean;
  minimo_jugadores: number;
  maximo_jugadores: number;
  permite_externos: boolean;
  id_sede: number;
  id_categoria: number;
  creado_por: number;
  actualizado_por: null;
  eliminado_por: null;
  creado_en: Date;
  actualizado_en: Date;
  eliminado_en: null;
  disponibilidad: Disponibilidad[];
  imagen: Imagen | null;
  sede: Sede;
  categoria: Categoria;
  configuracion: Configuracion;
  novedades: Novedad[];
}

export interface Disponibilidad {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  valor: null;
  estilos: Estilos;
  novedad: null;
}

export interface Estilos {
  background_color: string;
  text_color: string;
  border_color: string;
}
