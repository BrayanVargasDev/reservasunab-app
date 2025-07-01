import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Espacio, type Configuracion } from '../interfaces';
import { GeneralResponse, Meta } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getConfigPorFecha = async (
  http: HttpClient,
  idEspacio: number | null,
  fecha: string | null = null,
): Promise<GeneralResponse<Configuracion>> => {
  const url = `${BASE_URL}/espacios/configuracion-base/fecha${
    idEspacio ? `?id_espacio=${idEspacio}` : ''
  }${fecha ? `&fecha=${fecha}` : ''}`;

  return firstValueFrom(
    http.get<GeneralResponse<Configuracion>>(url)
  );
};
