import { Categoria, Sede } from '@shared/interfaces';
import { Configuracion } from '@espacios/interfaces';
import { Imagen } from '../../espacios/interfaces/imagen.interface';

export interface EspacioReservas {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: Imagen | null;
  id_sede: string;
  id_categoria: string;
  sede: Sede;
  categoria: Categoria;
  configuraciones: Configuracion[];
}
