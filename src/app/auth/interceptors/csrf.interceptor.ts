import type { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QueryClient } from '@tanstack/angular-query-experimental';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const qc = inject(QueryClient);

  return next(req).pipe(
    catchError(err => {
      if (err.status === 419) {
        return http
          .get('/sanctum/csrf-cookie', { withCredentials: true })
          .pipe(switchMap(() => next(req)));
      }

      if (err.status === 401) {
        qc.setQueryData(['user'], null);
      }
      return throwError(() => err);
    }),
  );
};
