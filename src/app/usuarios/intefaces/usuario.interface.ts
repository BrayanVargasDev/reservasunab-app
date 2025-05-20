export interface Usuario {
  id: number;
  avatar: string;
  email: string;
  tipoUsuario: string;
  rol: string;
  documento: string;
  nombre: string;
  apellido: string;
  ultimoAcceso: string;
  estado: string;
  fechaCreacion: string;
  viendoDetalles?: boolean;
}
