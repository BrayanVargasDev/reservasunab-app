export interface FormEspacio {
  nombre: string;
  descripcion: string;
  categoria: number;
  sede: number;
  permitirJugadores: boolean;
  permitirExternos: boolean;
  aprobarReservas?: boolean;
  minimoJugadores?: number;
  maximoJugadores?: number;
  imagen?: File;
}
