import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type Elemento, type GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

// Búsqueda de elementos para reservas, similar a buscarJugadores
export const buscarElementos = async (
  http: HttpClient,
  termino: string,
  idEspacio: number | null,
): Promise<GeneralResponse<Elemento>> => {
  const params = new URLSearchParams({
    search: termino?.trim() || '',
    id_espacio: String(idEspacio),
  });
  const url = `${BASE_URL}/elementos?${params.toString()}`;
  return firstValueFrom(http.get<GeneralResponse<Elemento>>(url));
};
