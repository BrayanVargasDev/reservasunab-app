import { Usuario } from '@usuarios/intefaces';
import { Elemento } from '@shared/interfaces';
import { Pago, Movimiento } from '@pagos/interfaces';

export interface ResumenReserva {
  id: number;
  nombre_espacio: string;
  id_espacio: number;
  duracion: number;
  sede: string;
  fecha: string;
  hora_inicio: string;
  valor: number;
  valor_descuento: number;
  valor_elementos?: number;
  valor_total_reserva?: number;
  porcentaje_descuento: number;
  estado: string;
  usuario_reserva: string;
  codigo_usuario: string;
  agrega_jugadores: boolean;
  permite_externos: boolean;
  minimo_jugadores: number;
  maximo_jugadores: number;
  jugadores?: Usuario[];
  detalles?: Elemento[];
  total_jugadores: number;
  puede_cancelar: boolean;
  es_pasada: boolean;
  puede_agregar_jugadores: boolean;
  necesita_aprobacion: boolean;
  reserva_aprovada: boolean;
  pagar_con_saldo: boolean;
  cubierta_por_mensualidad: boolean;
  pago: Pago | Movimiento | null;
  creado_en: string;
}
