export interface PagoInfo {
  pago: PagoDatum;
  transaccion: TransaccionPago;
  reserva: ReservaPago;
  mensualidad: MensualidadPago;
}

export interface PagoDatum {
  codigo: string;
  valor: string;
  estado: string;
  ticket_id: string;
  creado_en: string;
  actualizado_en: string;
}

export interface ReservaPago {
  id: number;
  hora_inicio: string;
  hora_fin: string;
  codigo: string;
  fecha: string;
  usuario: UsuarioPago;
  espacio: EspacioPago;
}

export interface EspacioPago {
  id: number;
  nombre: string;
}

export interface UsuarioPago {
  id: null;
  tipo_documento: string;
  documento: string;
  nombre_completo: string;
  email: string;
  celular: string;
}

export interface TransaccionPago {
  entidad: string;
  moneda: string;
  fecha_banco: string;
  codigo_traza: string;
  tipo: string;
  cuotas: string;
  digitos: string;
  titular: string;
  doc_titular: string;
}

export interface GetPagoInfoParams {
  codigo: string;
}

export interface MensualidadPago {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  usuario: UsuarioPago;
  espacio: EspacioPago;
}
