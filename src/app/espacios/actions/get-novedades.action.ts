import { PaginationState } from '@tanstack/angular-table';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Novedad } from '../interfaces';
import {
  PaginatedResponse,
  Meta,
} from '@shared/interfaces/paginatd-response.interface';

const BASE_URL = environment.apiUrl;

export const getNovedades = async (
  http: HttpClient,
  idEspacio: number | null,
  params: PaginationState,
): Promise<PaginatedResponse<Novedad>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
  });

  if (idEspacio) {
    queryParams.append('id_espacio', idEspacio.toString());
  }

  const url = `${BASE_URL}/espacios/novedades?${queryParams.toString()}`;

  return firstValueFrom(
    http.get<PaginatedResponse<Novedad>>(url)
  );
};
