import { HttpClient } from '@angular/common/http';
import { Usuario } from '@usuarios/intefaces';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';
import { GeneralResponse } from '@shared/interfaces';
import { UsuarioLogueado } from '../interfaces/usuario-logueado.interface';

const API = environment.apiUrl;

export const getUser = (http: HttpClient) =>
  firstValueFrom(http.get<GeneralResponse<UsuarioLogueado>>(`${API}/me`));
