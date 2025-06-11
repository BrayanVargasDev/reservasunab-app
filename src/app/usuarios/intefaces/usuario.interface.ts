import { TipoUsuario } from '@shared/enums/usuarios.enum';
import { Estado } from '@shared/enums/usuarios.enum';

export interface Usuario {
  id: number;
  avatar: string;
  email: string;
  tipoUsuario: TipoUsuario;
  telefono: string;
  rol: string;
  tipoDocumento: number;
  documento: string;
  nombre: string;
  apellido: string;
  ultimoAcceso: string;
  estado: Estado;
  fechaCreacion: string;
  viendoDetalles?: boolean;
  direccion: string;
  fechaNacimiento: string;
}
