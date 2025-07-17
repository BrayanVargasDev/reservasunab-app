export interface Reserva {
  id: number;
  id_usuario: number;
  id_espacio: number;
  fecha: Date;
  id_configuracion: number;
  estado: string;
  hora_inicio: Date;
  hora_fin: Date;
  check_in: boolean;
  codigo: string;
  creado_en: Date;
  actualizado_en: Date;
  eliminado_en: null;
  pago: Pago;
  espacio: Espacio;
}

export interface Espacio {
  id: number;
  nombre: string;
  id_sede: number;
  id_categoria: number;
  sede: Categoria;
  categoria: Categoria;
  imagen: Imagen;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Imagen {
  id_espacio: number;
  ubicacion: string;
}

export interface Pago {
  codigo: string;
  ticket_id: number;
  id_reserva: number;
  valor: string;
  estado: string;
  url_ecollect: string;
  creado_en: Date;
  actualizado_en: Date;
  eliminado_en: null;
}
