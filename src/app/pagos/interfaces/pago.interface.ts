export interface PagoInfo {
  id: string;
  codigo: string;
  monto: number;
  estado: 'pendiente' | 'completado' | 'rechazado' | 'procesando';
  fechaCreacion: string;
  fechaActualizacion: string;
  metodoPago: string;
  referencia: string;
  reserva: {
    id: string;
    codigo: string;
    usuario: {
      nombre: string;
      email: string;
      documento: string;
    };
    servicio: {
      nombre: string;
      descripcion: string;
    };
    fecha: string;
    hora: string;
  };
  transaccion?: {
    id: string;
    numeroTransaccion: string;
    fecha: string;
    mensaje?: string;
  };
}

export interface GetPagoInfoParams {
  codigo: string;
}
