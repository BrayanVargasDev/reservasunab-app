export interface CamposFacturacion {
  id_usuario: number;
  ciudadExpedicion: number;
  ciudadResidencia: number;
  tipoPersona: string;
  regimenTributario?: number;
  digitoVerificacion?: number;
}
