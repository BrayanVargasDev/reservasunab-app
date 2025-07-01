import { PaginationState } from '@tanstack/angular-table';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Espacio } from '../interfaces';
import {
  PaginatedResponse,
  Meta,
} from '@shared/interfaces/paginatd-response.interface';

const BASE_URL = environment.apiUrl;

export const getEspacios = async (
  http: HttpClient,
  params: PaginationState & { search?: string },
): Promise<PaginatedResponse<Espacio>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
    search: params.search?.trim() || '',
  });

  const url = `${BASE_URL}/espacios?${queryParams.toString()}`;

  return firstValueFrom(
    http.get<PaginatedResponse<Espacio>>(url)
  );
};
