import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Pago, GetPagosParams } from '../interfaces';
import { PaginatedResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getPagos = async (
  http: HttpClient,
  params: GetPagosParams,
): Promise<PaginatedResponse<Pago>> => {
  const queryParams = new URLSearchParams({
    page: (params.pageIndex + 1).toString(),
    per_page: params.pageSize.toString(),
  });

  if (params.search) {
    queryParams.append('search', params.search);
  }

  const url = `${BASE_URL}/pagos?${queryParams.toString()}`;

  return firstValueFrom(http.get<PaginatedResponse<Pago>>(url));
};
