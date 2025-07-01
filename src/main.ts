import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import {
  provideHttpClient,
  withXsrfConfiguration,
  withInterceptors,
} from '@angular/common/http';

import {
  provideTanStackQuery,
  QueryClient,
  withDevtools,
} from '@tanstack/angular-query-experimental';

import { routes } from '@app/app.routes';
import { AppComponent } from '@app/app.component';
import { autenticarInterceptor } from '@auth/interceptors/autenticar.interceptor';
import { errorInterceptor } from '@shared/interceptors/error.interceptor';
import { csrfInterceptor } from '@auth/interceptors/csrf.interceptor';
import { xsrfHeaderInterceptor } from './app/auth/interceptors/xsrf-header.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
      withInterceptors([
        xsrfHeaderInterceptor,
        csrfInterceptor,
        autenticarInterceptor,
        errorInterceptor,
      ]),
    ),
    provideTanStackQuery(
      new QueryClient(),
      withDevtools(() => ({ loadDevtools: 'auto' })),
    ),
    provideZonelessChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
