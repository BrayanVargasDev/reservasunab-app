import { TipoDocumento } from './tipo-documento.interface';

export interface Persona {
  id_persona: number;
  tipo_documento_id: number;
  numero_documento: string;
  primer_nombre: string;
  segundo_nombre: null;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  celular: string;
  id_usuario: number;
  creado_en: string;
  actualizado_en: string;
  tipo_persona: string;
  regimen_tributario_id: number;
  ciudad_expedicion_id: number;
  ciudad_residencia_id: number;
  tipo_documento: TipoDocumento;
  es_persona_facturacion?: boolean;
  persona_facturacion_id?: number;
}
