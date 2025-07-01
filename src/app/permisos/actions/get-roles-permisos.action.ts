import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type RolPermisos } from '../interfaces';

import { PaginationState } from '@tanstack/angular-table';
import { PaginatedResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRolesPermisos = async (
  http: HttpClient,
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<RolPermisos>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search || '',
  });

  const url = `${BASE_URL}/roles/permisos?${queryParams.toString()}`;

  return firstValueFrom(
    http.get<PaginatedResponse<RolPermisos>>(url)
  );
};
