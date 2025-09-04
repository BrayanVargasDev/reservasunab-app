export interface FormEspacio {
  nombre: string;
  descripcion: string;
  categoria: number;
  sede: number;
  permitirJugadores: boolean;
  permitirExternos: boolean;
  aprobarReservas?: boolean;
  limiteTiempoReserva?: number; // minutos para poder reservar
  reservaDespuesDeLaHora?: boolean; // true: después de la hora; false: antes
  minimoJugadores?: number;
  maximoJugadores?: number;
  pagoMensualidad?: boolean;
  valorMensualidad?: number | null;
  imagen?: File;
}
