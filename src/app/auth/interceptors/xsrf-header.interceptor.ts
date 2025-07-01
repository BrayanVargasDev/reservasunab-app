import type { HttpInterceptorFn } from '@angular/common/http';

function xsrfTokenFromCookie(): string | undefined {
  const m = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

export const xsrfHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const token = xsrfTokenFromCookie();
  const needs = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);

  return next(
    needs && token
      ? req.clone({
          withCredentials: true,
          setHeaders: {
            'X-XSRF-TOKEN': token,
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
      : req.clone({ withCredentials: true }),
  );
};
