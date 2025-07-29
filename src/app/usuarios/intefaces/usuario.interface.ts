import { TipoUsuario } from '@shared/enums/usuarios.enum';
import { Estado } from '@shared/enums/usuarios.enum';

export interface Usuario {
  id: number;
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
  codigo_usuario?: string;
  ciudadExpedicion: number;
  ciudadResidencia: number;
  tipoPersona: string;
  regimenTributario?: number;
  digitoVerificacion?: number;
}
