import { Sede, Categoria, CreadoPor } from '@shared/interfaces';
import { Novedad } from './novedad.interface';
import { Configuracion } from './configuracion.interface';
import { TipoUsuarioConfig } from './tipo-usuario-config.interface';
import { Imagen } from './imagen.interface';

export interface EspacioParaConfig {
  id: number;
  nombre: string;
  descripcion: string;
  agregar_jugadores: boolean;
  minimo_jugadores: number;
  maximo_jugadores: number;
  permite_externos: boolean;
  id_sede: string;
  id_categoria: string;
  creado_por: CreadoPor;
  actualizado_por: null;
  eliminado_por: null;
  creado_en: string;
  actualizado_en: string | null;
  eliminado_en: string | null;
  sede: Sede;
  categoria: Categoria;
  configuraciones: Configuracion[];
  novedades: Novedad[];
  imagen: Imagen;
  tipo_usuario_config: TipoUsuarioConfig[];
}
