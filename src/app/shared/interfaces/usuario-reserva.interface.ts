import { TipoUsuario } from '@shared/enums';
import { Persona } from './persona.interface';

export interface UsuarioReserva {
  id_usuario: number;
  email: string;
  id_rol: number;
  ldap_uid: null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  eliminado_en: null;
  avatar: null;
  tipos_usuario: TipoUsuario[];
  perfil_completado: boolean;
  terminos_condiciones: boolean;
  persona: Persona;
}
