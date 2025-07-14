import { Routes } from '@angular/router';

export const pagosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/pagos-main/pagos-main.page').then((m) => m.PagosMainPage),
  },
  {
    path: 'reservas',
    loadComponent: () =>
      import('./pages/pago-redirect/pago-redirect.page').then((m) => m.PagoRedirectPage),
  },
];
