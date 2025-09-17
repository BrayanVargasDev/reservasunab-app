import { Reserva,Mensualidad } from '@reservas/interfaces';
export interface Pago {
  codigo: string;
  ticket_id: number;
  id_reserva: number;
  valor: string;
  estado: string;
  url_ecollect: string;
  creado_en: string;
  actualizado_en: string;
  eliminado_en: null;
  reserva: Reserva | null;
  mensualidad: Mensualidad | null;
}

// Interface para los parámetros de consulta de pagos
export interface GetPagosParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
}
