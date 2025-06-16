import { environment } from '@environments/environment';
import { type RolPermisos } from '../interfaces';

import { PaginationState } from '@tanstack/angular-table';
import { PaginatedResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRolesPermisos = async (
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<RolPermisos>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search || '',
  });

  const url = `${BASE_URL}/roles/permisos?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getRoles action:', error);
    throw error;
  }
};
