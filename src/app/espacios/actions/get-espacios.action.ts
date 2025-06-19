import { PaginationState } from '@tanstack/angular-table';
import { environment } from '@environments/environment';
import { type Espacio } from '../interfaces';
import {
  PaginatedResponse,
  Meta,
} from '@shared/interfaces/paginatd-response.interface';

const BASE_URL = environment.apiUrl;

export const getEspacios = async (
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<Espacio>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search?.trim() || '',
  });

  const url = `${BASE_URL}/espacios?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getEspacios action:', error);
    throw error;
  }
};
