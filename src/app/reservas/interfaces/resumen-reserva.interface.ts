export interface ResumenReserva {
  nombre_espacio: string;
  duracion: number;
  sede: string;
  fecha: string;
  hora_inicio: string;
  valor?: number;
  estado: string;
  usuario_reserva: string;
  codigo_usuario: string;
  agrega_jugadores: boolean;
}
