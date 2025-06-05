import { Routes } from '@angular/router';

export const permisosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/permisos-main/permisos-main.page').then(
        (m) => m.PermisosMainPage,
      ),
  },
];
