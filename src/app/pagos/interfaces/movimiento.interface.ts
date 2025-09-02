export interface Movimiento {
  id: number;
  id_usuario: number;
  id_reserva: number;
  fecha: string;
  valor: string;
  tipo: string;
  creado_en: string;
  creado_por: number;
  actualizado_en: string;
  eliminado_en: null;
  id_movimiento_principal: number;
}
