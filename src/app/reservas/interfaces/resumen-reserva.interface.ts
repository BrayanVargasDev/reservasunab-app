import { Usuario } from '@usuarios/intefaces';

export interface ResumenReserva {
  id: number;
  nombre_espacio: string;
  duracion: number;
  sede: string;
  fecha: string;
  hora_inicio: string;
  valor: number;
  estado: string;
  usuario_reserva: string;
  codigo_usuario: string;
  agrega_jugadores: boolean;
  permite_externos: boolean;
  minimo_jugadores: number;
  maximo_jugadores: number;
  jugadores?: Usuario[];
  total_jugadores: number;
  puede_agregar_jugadores: boolean;
}

