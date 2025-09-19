import { PaginationState } from '@tanstack/angular-table';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Elemento, type PaginatedResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getElementos = async (
  http: HttpClient,
  params: PaginationState & { search?: string; fromCrud?: boolean },
): Promise<PaginatedResponse<Elemento>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search?.trim() || '',
    from_crud: params.fromCrud ? 'true' : 'false',
  });

  const url = `${BASE_URL}/elementos?${queryParams.toString()}`;

  return firstValueFrom(http.get<PaginatedResponse<Elemento>>(url));
};
