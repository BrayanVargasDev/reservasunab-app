import { TipoUsuario } from '@shared/enums';

export interface TipoUsuarioConfig {
  id: number;
  tipo_usuario: TipoUsuario;
  porcentaje_descuento: number;
  retraso_reserva: number;
  creado_en: string;
  eliminado_en: string | null;
}
