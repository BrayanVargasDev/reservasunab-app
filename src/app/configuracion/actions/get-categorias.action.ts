import { PaginationState } from '@tanstack/angular-table';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Categoria } from '@shared/interfaces';
import { PaginatedResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getCategorias = async (
  http: HttpClient,
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<Categoria>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search?.trim() || '',
  });

  const url = `${BASE_URL}/categorias?${queryParams.toString()}`;

  return firstValueFrom(
    http.get<PaginatedResponse<Categoria>>(url)
  );
};
