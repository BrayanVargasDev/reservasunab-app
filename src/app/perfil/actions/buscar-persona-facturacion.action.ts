import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, Persona } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const buscarPersonaFacturacion = async (
  http: HttpClient,
  params: {
    tipo_documento_id?: number;
    numero_documento: string;
  },
): Promise<GeneralResponse<Persona | null>> => {
  const query = new URLSearchParams();
  if (params.tipo_documento_id !== undefined) {
    query.set('tipo_documento_id', String(params.tipo_documento_id));
  }

  query.set('numero_documento', params.numero_documento);

  const url = `${BASE_URL}/personas/facturacion?${query.toString()}`;
  return await firstValueFrom(http.get<GeneralResponse<Persona | null>>(url));
};
