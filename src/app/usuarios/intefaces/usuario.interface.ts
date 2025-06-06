export interface Usuario {
  id: number;
  avatar: string;
  email: string;
  tipoUsuario: string;
  telefono: string;
  rol: string;
  tipoDocumento: number;
  documento: string;
  nombre: string;
  apellido: string;
  ultimoAcceso: string;
  estado: string;
  fechaCreacion: string;
  viendoDetalles?: boolean;
  direccion: string;
  fechaNacimiento: string;
}
