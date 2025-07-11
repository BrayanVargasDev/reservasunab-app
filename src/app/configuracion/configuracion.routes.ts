import { Routes } from '@angular/router';

export const configRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/config-main/config-main.page'),
  },
];
