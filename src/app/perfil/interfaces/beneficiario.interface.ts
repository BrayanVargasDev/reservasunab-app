import { TipoDocumento } from '@shared/interfaces/tipo-documento.interface';

export interface Beneficiario {
  id: number;
  nombre: string;
  apellido: string;
  tipo_documento: TipoDocumento;
  documento: string;
  parentesco: string;
  creadoEn?: string;
}
