import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';

const RUTAS_PUBLICAS = [
  '/auth/login',
  '/auth/registro',
  '/auth/reset-password',
];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastController);
  const router = inject(Router);
  const url = router.url;
  const esPublica = RUTAS_PUBLICAS.some(ruta => url.includes(ruta))
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('href', window.location.href);
      const esRutaPublica = RUTAS_PUBLICAS.some(r =>
        window.location.href.includes(r),
      );
      const esUserCall = req.url.endsWith('/me');

      if (error.status === 401 && !esRutaPublica) {
        router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      if (esRutaPublica && esUserCall) {
        return throwError(() => error);
      }

      let errorMessage = 'Ha ocurrido un error inesperado';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = error.error?.errors
          ? Object.values(error.error.errors).join(', ')
          : error.error?.message || 'Error desconocido';
      }

      toastController
        .create({
          message: errorMessage,
          duration: 4000,
          color: 'danger',
          position: 'bottom',
          buttons: [{ text: 'Cerrar', role: 'cancel' }],
          cssClass: 'toast-error',
        })
        .then(t => t.present());

      return throwError(() => error);
    }),
  );
};
