import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Permiso } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const getPermisosDisponibles = async (http: HttpClient): Promise<Permiso[]> => {
  const url = `${BASE_URL}/permisos/disponibles`;

  const response = await firstValueFrom(
    http.get<{ data?: Permiso[] } | Permiso[]>(url)
  );

  return Array.isArray(response) ? response : response.data || [];
};
