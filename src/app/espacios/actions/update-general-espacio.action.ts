import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { type FormEspacio, type Espacio } from '../interfaces';
import { GeneralResponse } from '@shared/interfaces';

const BASE_URL = environment.apiUrl;

export const updateGeneralEspacio = async (
  http: HttpClient,
  params: FormEspacio,
  idEspacio: number,
): Promise<GeneralResponse<Espacio>> => {
  const url = `${BASE_URL}/espacios/${idEspacio}`;
  let formData: FormData = new FormData();

  if (params.imagen) {
    formData.append('imagen', params.imagen);
    delete params.imagen;
  }

  formData.append('_method', 'PATCH');
  formData.append('payload', JSON.stringify(params));

  return firstValueFrom(
    http.post<GeneralResponse<Espacio>>(url, formData)
  );
};
