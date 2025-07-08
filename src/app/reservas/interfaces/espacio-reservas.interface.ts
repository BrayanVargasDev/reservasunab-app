import { Categoria, Sede } from '@shared/interfaces';
import { Configuracion } from '@espacios/interfaces';
import { Imagen } from '../../espacios/interfaces/imagen.interface';

export interface EspacioReservas {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  id_sede: string;
  id_categoria: string;
  sede: string;
  categoria: string;
  configuraciones: Configuracion;
}
