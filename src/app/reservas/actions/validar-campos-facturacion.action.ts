import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Usuario } from '@usuarios/intefaces';

const BASE_URL = environment.apiUrl;

export interface CamposFacturacionResponse {
  usuario: Usuario;
  puede_pagar: boolean;
}

export const validarCamposFacturacion = async (
  http: HttpClient,
  idUsuario: number,
): Promise<GeneralResponse<CamposFacturacionResponse>> => {
  const url = `${BASE_URL}/usuarios/${idUsuario}/validar-campos-facturacion`;

  return firstValueFrom(
    http.get<GeneralResponse<CamposFacturacionResponse>>(url),
  );
};
