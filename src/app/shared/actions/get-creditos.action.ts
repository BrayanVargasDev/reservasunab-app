import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { UsuarioLogueado } from '@auth/interfaces/usuario-logueado.interface';

const API = environment.apiUrl;

export const getCreditos = (http: HttpClient) =>
  firstValueFrom(http.get<GeneralResponse<number>>(`${API}/creditos`));
