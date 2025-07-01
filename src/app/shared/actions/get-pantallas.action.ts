import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '@environments/environment';
import { type Pantalla } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getPantallas = async (http: HttpClient): Promise<Pantalla[]> => {
  return firstValueFrom(http.get<Pantalla[]>(`${BASE_URL}/pantallas`));
};
