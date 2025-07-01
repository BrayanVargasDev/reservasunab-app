import { Routes } from '@angular/router';

export const dreservasRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/reservas-main/reservas-main.page'),
  },
  {
    path: 'd',
    loadComponent: () => import('./pages/dreservas-main/dreservas-main.page'),
  },
];
