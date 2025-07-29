import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { PaginatedResponse, RegimenTributario } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getRegimenesTributarios = async (
  http: HttpClient,
): Promise<PaginatedResponse<RegimenTributario>> => {
  return firstValueFrom(
    http.get<PaginatedResponse<RegimenTributario>>(
      `${BASE_URL}/regimenes-tributarios`,
    ),
  );
};
