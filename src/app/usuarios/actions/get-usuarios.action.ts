import { PaginationState } from '@tanstack/angular-table';
import { environment } from '@environments/environment';
import { type Usuario, GetUsuariosParams } from '../intefaces';
import {
  PaginatedResponse,
  Meta,
} from '@shared/interfaces/paginatd-response.interface';

const BASE_URL = environment.apiUrl;

export const getUsuarios = async (
  params: PaginationState & GetUsuariosParams,
): Promise<PaginatedResponse<Usuario>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search?.trim() || '',
  });

  const url = `${BASE_URL}/usuarios?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error in getUsuarios action:', error);
    throw error;
  }
};
