import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError, of, map } from 'rxjs';

export const autenticarInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const initialToken = authService.getToken();
  const isAuthEndpoint =
    req.url.includes('/refresh') ||
    req.url.includes('/intercambiar') ||
    req.url.includes('/ingresar');

  const getToken$ = isAuthEndpoint
    ? of(initialToken)
    : initialToken
    ? of(initialToken)
    : authService.isSessionValid()
    ? authService
        .refreshAccessToken()
        .pipe(map(refreshed => (refreshed ? authService.getToken() : null)))
    : of<string | null>(null);

  return getToken$.pipe(
    switchMap(token => {
      let authReq = req.clone({ withCredentials: true });
      authReq = authReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }),
    catchError(err => {
      // Sólo manejar 401 aquí; otros códigos se delegan al errorInterceptor
      if (err?.status !== 401 && err?.message !== 'No token available')
        return throwError(() => err);

      // Evitar bucles: si la petición era al endpoint de refresh o intercambio, salir
      const isRefreshCall = req.url.includes('/refresh');
      const isExchangeCall = req.url.includes('/intercambiar');
      if (isRefreshCall || isExchangeCall) {
        authService.clearSession();
        const currentUrl = router.url;
        const isPublic = [
          '/auth/login',
          '/auth/registro',
          '/auth/reset-password',
          '/acceso-denegado',
          '/404',
        ].some(r => currentUrl.includes(r));
        router.navigate(['/auth/login'], {
          replaceUrl: true,
          queryParams: isPublic ? undefined : { returnUrl: currentUrl },
        });
        return throwError(() => err);
      }

      // Intentar refrescar el token y reintentar la petición original
      return authService.refreshAccessToken().pipe(
        switchMap(refreshed => {
          if (!refreshed) {
            authService.clearSession();
            const currentUrl = router.url;
            const isPublic = [
              '/auth/login',
              '/auth/registro',
              '/auth/reset-password',
              '/acceso-denegado',
              '/404',
            ].some(r => currentUrl.includes(r));
            router.navigate(['/auth/login'], {
              replaceUrl: true,
              queryParams: isPublic ? undefined : { returnUrl: currentUrl },
            });
            return throwError(() => err);
          }

          const newToken = authService.getToken();
          let retryReq = req.clone({ withCredentials: true });
          if (newToken) {
            retryReq = retryReq.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
          }
          return next(retryReq);
        }),
        catchError(refreshErr => {
          authService.clearSession();
          const currentUrl = router.url;
          const isPublic = [
            '/auth/login',
            '/auth/registro',
            '/auth/reset-password',
            '/acceso-denegado',
            '/404',
          ].some(r => currentUrl.includes(r));
          router.navigate(['/auth/login'], {
            replaceUrl: true,
            queryParams: isPublic ? undefined : { returnUrl: currentUrl },
          });
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
