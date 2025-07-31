import { Routes } from '@angular/router';

export const dreservasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dreservas-main/dreservas-main.page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/reservas-main/reservas-main.page'),
  },
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/mis-reservas/mis-reservas.page'),
  },
];
