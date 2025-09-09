import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Edificio } from '../interfaces';
import { type GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getEdificios = async (
  http: HttpClient,
): Promise<GeneralResponse<Edificio[]>> => {
  const url = `${BASE_URL}/edificios`;

  return firstValueFrom(http.get<GeneralResponse<Edificio[]>>(url));
};
