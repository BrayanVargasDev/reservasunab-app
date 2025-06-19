export interface FormEspacio {
  nombre: string;
  descripcion: string;
  categoria: number;
  sede: number;
  permitirJugadores: boolean;
  permitirExternos: boolean;
  minimoJugadores?: number;
  maximoJugadores?: number;
}
