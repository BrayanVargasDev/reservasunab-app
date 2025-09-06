import { Sede, Categoria } from '@shared/interfaces';
import { Configuracion, Novedad, Imagen } from '@espacios/interfaces';
import { TipoUsuarioConfig } from '@espacios/interfaces/tipo-usuario-config.interface';
import { Mensualidad } from './mensualidad.interface';

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
  pago_mensual: boolean;
  valor_mensualidad: number;
  usuario_mensualidad_activa: boolean;
  mensualidad: Mensualidad;
  tipo_usuario_config: TipoUsuarioConfig[];
}

export interface Disponibilidad {
  hora_inicio: string;
  hora_fin: string;
  disponible: boolean;
  mi_reserva: boolean;
  id_reserva: number | null;
  reserva_pasada: boolean;
  valor: null;
  estilos: Estilos;
  novedad: boolean;
  reservada: boolean;
  novedad_desc?: string;
}

export interface Estilos {
  background_color: string;
  text_color: string;
  border_color: string;
}
