import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AuthService } from '@auth/services/auth.service';

const RUTAS_PUBLICAS = [
  '/auth/login',
  '/auth/registro',
  '/auth/reset-password',
  '/acceso-denegado',
  '/404',
  '/pagos/reservas',
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const currentUrl = router.url;
      const esRutaPublica = RUTAS_PUBLICAS.some(ruta =>
        currentUrl.includes(ruta),
      );
      const esUserCall = req.url.includes('/me') || req.url.includes('/user');
      const esAuthCall = req.url.includes('/login') || req.url.includes('/intercambiar') || req.url.includes('/saml');

      console.debug(`HTTP Error ${error.status} for ${req.method} ${req.url}`);

      // 401 - No autorizado
      if (error.status === 401) {
        // Si estamos en una ruta pública y es una llamada de auth, dejar que se maneje normalmente
        if (esRutaPublica && esAuthCall) {
          return throwError(() => error);
        }

        // Si no estamos en ruta pública y no es una llamada de auth, intentar refresh o redirigir
        if (!esRutaPublica && !esAuthCall) {
          console.warn('401 error on protected route, clearing session');
          authService.clearSession();
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: currentUrl },
            replaceUrl: true
          });
        }

        return throwError(() => error);
      }

      // 403 - Prohibido/Sin permisos
      if (error.status === 403) {
        if (!esRutaPublica) {
          console.warn('403 error on protected route, redirecting to access denied');
          router.navigate(['/acceso-denegado'], { replaceUrl: true });
        }
        return throwError(() => error);
      }

      // 404 - No encontrado
      if (error.status === 404) {
        console.warn(`404 error for ${req.url}`);
        if (!esRutaPublica) {
          router.navigate(['/404'], { replaceUrl: true });
        }
        return throwError(() => error);
      }

      // 500 - Error del servidor
      if (error.status >= 500) {
        console.error(`Server error ${error.status} for ${req.url}`, error);
        // Podríamos mostrar un toast de error del servidor aquí
      }

      // Si es una llamada al endpoint de usuario y estamos en ruta pública, no mostrar error
      if (esRutaPublica && esUserCall) {
        return throwError(() => error);
      }

      // Para otros errores, extraer mensaje útil
      let errorMessage = 'Ha ocurrido un error inesperado';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error de conexión: ${error.error.message}`;
      } else if (error.error) {
        // Error del lado del servidor
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error.errors && typeof error.error.errors === 'object') {
          errorMessage = Object.values(error.error.errors).join(', ');
        }
      }

      console.error(`HTTP Error ${error.status}: ${errorMessage}`);

      return throwError(() => error);
    }),
  );
};
