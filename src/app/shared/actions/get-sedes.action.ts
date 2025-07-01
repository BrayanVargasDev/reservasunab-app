import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { type Sede } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getSedes = async (
  http: HttpClient,
): Promise<GeneralResponse<Sede[]>> => {
  return firstValueFrom(http.get<GeneralResponse<Sede[]>>(`${BASE_URL}/sedes`));
};
