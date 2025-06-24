import { FranjaHoraria } from '@espacios/interfaces';

export interface Configuracion {
  id?: number;
  id_espacio?: number;
  dia_semana?: number;
  fecha?: string;
  minutos_uso: number;
  dias_previos_apertura: number;
  hora_apertura: string;
  tiempo_cancelacion: number;
  eliminado_en?: string;
  franjas_horarias: FranjaHoraria[];
}
