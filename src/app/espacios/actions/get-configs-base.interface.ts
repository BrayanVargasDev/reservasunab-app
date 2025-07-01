import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { type Espacio, type Configuracion } from '../interfaces';
import { GeneralResponse, Meta } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getConfigsBase = async (
  http: HttpClient,
  idEspacio: number | null,
): Promise<GeneralResponse<Configuracion[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<Configuracion[]>>(
      `${BASE_URL}/espacios/configuracion-base/${
        idEspacio ? `?id_espacio=${idEspacio}` : ''
      }`,
    ),
  );
};
