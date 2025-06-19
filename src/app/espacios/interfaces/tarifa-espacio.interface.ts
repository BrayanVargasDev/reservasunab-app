export interface TarifaEspacio {
  id: number;
  tipo: string;
  monto: number;
  fechaInicio: Date;
  fechaFin?: Date;
}
