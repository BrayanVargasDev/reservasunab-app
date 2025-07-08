import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type RolPermisos, type Permiso } from '../interfaces';
import { CreateRolRequest } from '../interfaces/create-rol.interface';

const BASE_URL = `${environment.apiUrl}/roles`;

export const actualizarRol = async (
  http: HttpClient,
  id: number,
  rol: CreateRolRequest,
): Promise<RolPermisos> => {
  const url = `${BASE_URL}/${id}`;

  return firstValueFrom(
    http.patch<RolPermisos>(url, rol)
  );
};
