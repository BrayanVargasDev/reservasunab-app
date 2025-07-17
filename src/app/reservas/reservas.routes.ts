import { Routes } from '@angular/router';

export const dreservasRoutes: Routes = [
  {
    path: '',
    redirectTo: 'd',
    pathMatch: 'full'
  },
  {
    path: 'd',
    loadComponent: () =>
      import('./pages/dreservas-main/dreservas-main.page'),
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/mis-reservas/mis-reservas.page'),
  },
];
