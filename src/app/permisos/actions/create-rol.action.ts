import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type RolPermisos, type Permiso } from '../interfaces';
import { CreateRolRequest } from '../interfaces/create-rol.interface';

const BASE_URL = `${environment.apiUrl}/roles`;

export const crearRol = async (
  http: HttpClient,
  rol: CreateRolRequest
): Promise<RolPermisos> => {
  return firstValueFrom(
    http.post<RolPermisos>(BASE_URL, rol)
  );
};
