import { Routes } from '@angular/router';

export const perfilRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/perfil-main/perfil-main.page').then(
        (m) => m.PerfilMainPage,
      ),
  },
];
