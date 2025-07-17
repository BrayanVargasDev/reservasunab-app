import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token inválido o expirado
          this.authService.clearSession();

          // Solo redirigir si no estamos ya en una ruta pública
          const currentUrl = this.router.url;
          const isPublicRoute = [
            '/auth/login',
            '/auth/registro',
            '/auth/reset-password',
            '/acceso-denegado',
            '/404'
          ].some(route => currentUrl.includes(route));

          if (!isPublicRoute) {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: currentUrl },
              replaceUrl: true
            });
          }
        }
        return throwError(() => error);
      })
    );
  }
}
