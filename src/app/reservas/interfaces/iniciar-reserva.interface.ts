import { ReservaEspaciosDetalles } from '@reservas/interfaces/reserva-espacio-detalle.interface';

export interface IniciarReserva {
  base: ReservaEspaciosDetalles;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}
