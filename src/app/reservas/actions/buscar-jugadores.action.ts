import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Usuario } from '@usuarios/intefaces';

const BASE_URL = environment.apiUrl;

export const buscarJugadores = async (
  http: HttpClient,
  termino: string,
  permiteExternos: boolean = false,
): Promise<GeneralResponse<Usuario[]>> => {
  const url = `${BASE_URL}/usuarios/buscar-jugadores`;

  let httpParams = new HttpParams();

  if (termino?.trim()) {
    httpParams = httpParams.append('term', termino.trim());
  }

  if (permiteExternos) {
    httpParams = httpParams.append('permiteExternos', 'true');
  }

  return firstValueFrom(
    http.get<GeneralResponse<Usuario[]>>(url, {
      params: httpParams,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
};
