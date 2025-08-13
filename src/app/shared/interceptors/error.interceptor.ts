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
      const esUserCall = req.url.endsWith('/me');

      // 401 se maneja en el interceptor de autenticación (refresh + reintento)
      if (error.status === 401) {
        return throwError(() => error);
      }

      // Manejar errores 403 (prohibido/sin permisos)
      if (error.status === 403 && !esRutaPublica) {
        router.navigate(['/acceso-denegado'], { replaceUrl: true });
        return throwError(() => error);
      }

      // Si es una llamada al endpoint de usuario y estamos en ruta pública, no mostrar error
      if (esRutaPublica && esUserCall) {
        return throwError(() => error);
      }

      // Manejar otros errores
      let errorMessage = 'Ha ocurrido un error inesperado';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = error.error?.errors
          ? Object.values(error.error.errors).join(', ')
          : error.error?.message || 'Error desconocido';
      }

      return throwError(() => error);
    }),
  );
};
