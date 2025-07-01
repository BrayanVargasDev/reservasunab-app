import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Permiso, type PermisosUsuario } from '../interfaces';

const BASE_URL = environment.apiUrl;

export const actualizarPermisosUsuario = async (
  http: HttpClient,
  userId: number,
  permisos: Permiso[]
): Promise<PermisosUsuario> => {
  const url = `${BASE_URL}/usuarios/${userId}/permisos`;

  return firstValueFrom(
    http.patch<PermisosUsuario>(url, { permisos })
  );
};
