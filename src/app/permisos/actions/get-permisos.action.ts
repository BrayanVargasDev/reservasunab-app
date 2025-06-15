import { environment } from '@environments/environment';
import { type PermisosUsuario } from '../interfaces';
import { PaginatedResponse } from '@shared/interfaces/paginatd-response.interface';
import { PaginationState } from '@tanstack/angular-table';

const BASE_URL = environment.apiUrl;

export const getPermisos = async (
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<PermisosUsuario>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search || '',
  });

  const url = `${BASE_URL}/permisos?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getPermisos action:', error);
    throw error;
  }
};
