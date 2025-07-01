import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

const BASE_URL = environment.apiUrl;

export const logoutAction = (http: HttpClient) =>
  firstValueFrom(
    http.post(`${BASE_URL}/logout`, {}),
  );
