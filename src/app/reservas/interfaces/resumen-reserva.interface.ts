import { Usuario } from '@usuarios/intefaces';

export interface ResumenReserva {
  id: number;
  nombre_espacio: string;
  duracion: number;
  sede: string;
  fecha: string;
  hora_inicio: string;
  valor: number;
  valor_descuento: number;
  porcentaje_descuento: number;
  estado: string;
  usuario_reserva: string;
  codigo_usuario: string;
  agrega_jugadores: boolean;
  permite_externos: boolean;
  minimo_jugadores: number;
  maximo_jugadores: number;
  jugadores?: Usuario[];
  total_jugadores: number;
  puede_cancelar: boolean;
  es_pasada: boolean;
  puede_agregar_jugadores: boolean;
  necesita_aprobacion: boolean;
  reserva_aprovada: boolean;
  pagar_con_saldo: boolean;
}
