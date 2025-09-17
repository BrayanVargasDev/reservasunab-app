import { UsuarioReserva } from '@shared/interfaces';
export interface Mensualidad {
  id: number;
  id_usuario: number;
  id_espacio: number;
  fecha_inicio: string;
  fecha_fin: string;
  valor: string;
  estado: string;
  creado_en: string;
  actualizado_en: string;
  eliminado_en: null;
  espacio?: Espacio;
  usuario?: UsuarioReserva;
}

interface Espacio {
  id: number;
  nombre: string;
  id_sede: number;
  id_categoria: number;
  sede: Categoria;
  categoria: Categoria;
  imagen: Imagen | null;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Imagen {
  id_espacio: number;
  ubicacion?: string;
}
