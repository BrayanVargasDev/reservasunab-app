import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse, ReservasPorCategoria } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getReservasPorCategoria = async (
  http: HttpClient,
): Promise<GeneralResponse<ReservasPorCategoria[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<ReservasPorCategoria[]>>(`${BASE_URL}/dashboard/reservas-por-categoria`),
  );
};
