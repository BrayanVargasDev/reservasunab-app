import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpClient,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';
import { refreshTokenAction } from '@auth/actions/refresh-token.action';
import { logoutAction } from '@auth/actions/log-out.action';
import { QueryClient } from '@tanstack/query-core';
import { GlobalLoaderService } from '../services/global-loader.service';

const RUTAS_PUBLICAS = [
  '/auth/login',
  '/auth/registro',
  '/auth/reset-password',
  '/acceso-denegado',
  '/404',
  '/pagos/reservas',
];

const API_URL = environment.apiUrl;

function isPublicRoute(url: string): boolean {
  return RUTAS_PUBLICAS.some(ruta => url.includes(ruta));
}

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const authService = inject(AuthService);
  const router = inject(Router);
  const globalLoader = inject(GlobalLoaderService);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isPublicRoute(req.url)
      ) {
        globalLoader.show('Sesión expirada', 'Redirigiendo al login...');
        authService.clearSession(true);
        window.location.href = '/auth/login';
        return throwError(() => error);
      }

      return throwError(() => error);
    }),
  );
}
