import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import type { Grupo } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export async function getGrupos(
  http: HttpClient,
): Promise<GeneralResponse<Grupo[]>> {
  return firstValueFrom(
    http.get<GeneralResponse<Grupo[]>>(`${BASE_URL}/grupos`),
  );
}
