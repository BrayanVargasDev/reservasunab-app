export interface FranjaHoraria {
  id: number;
  tipo: string;
  monto: number;
  fechaInicio: Date;
  fechaFin?: Date;
}
