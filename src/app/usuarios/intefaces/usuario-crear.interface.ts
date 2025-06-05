export interface UsuarioCrear {
  id?: number;
  avatar?: string;
  email: string;
  tipoUsuario: string;
  telefono: string;
  rol: string;
  documento: string;
  nombre: string;
  apellido: string;
  ultimo_acceso?: string;
  estado?: string;
  fechaCreacion?: string;
  viendoDetalles?: boolean;
  direccion?: string;
  fechaNacimiento?: string;
  tipoDocumento: string;
  imagen?: string;
}
