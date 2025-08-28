import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { Beneficiario } from '../interfaces/beneficiario.interface';

const BASE_URL = environment.apiUrl;

export const getBeneficiarios = async (
  http: HttpClient,
): Promise<GeneralResponse<Beneficiario[]>> => {
  return firstValueFrom(
    http.get<GeneralResponse<Beneficiario[]>>(`${BASE_URL}/beneficiarios`),
  );
};

export const createBeneficiario = async (
  http: HttpClient,
  payload: Omit<Beneficiario, 'id' | 'creadoEn'>,
): Promise<GeneralResponse<Beneficiario>> => {
  return firstValueFrom(
    http.post<GeneralResponse<Beneficiario>>(
      `${BASE_URL}/beneficiarios`,
      payload,
    ),
  );
};

export const deleteBeneficiario = async (
  http: HttpClient,
  id: number,
): Promise<GeneralResponse<null>> => {
  return firstValueFrom(
    http.delete<GeneralResponse<null>>(`${BASE_URL}/beneficiarios/${id}`),
  );
};
