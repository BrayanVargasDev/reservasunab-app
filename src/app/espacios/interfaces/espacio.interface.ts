import { NovedadEspacio } from './novedad-espacio.interface';
import { TarifaEspacio } from './tarifa-espacio.interface';
import { ConfiguracionEspacioBase } from './config-base-espacio.interface';

export interface Espacio {
  id: number;
  nombre: string;
  descripcion: string;
  tipoEspacio: string;
  estado: string;
}
