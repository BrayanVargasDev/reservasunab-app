import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const getAniosReservas = async (
  http: HttpClient,
): Promise<GeneralResponse<number[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<number[]>>(
      `${BASE_URL}/dashboard/anios-con-reservas`,
    ),
  );
};
