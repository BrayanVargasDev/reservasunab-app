import { environment } from '@environments/environment';
import { type Rol } from '../interfaces';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRoles = async (
  http: HttpClient,
): Promise<GeneralResponse<Rol[]>> => {
  return firstValueFrom(http.get<GeneralResponse<Rol[]>>(`${BASE_URL}/roles`));
};
