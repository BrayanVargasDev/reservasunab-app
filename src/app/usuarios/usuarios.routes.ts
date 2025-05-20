import { Routes } from '@angular/router';

export const usuariosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/usuarios-main/usuarios-main.page').then(
        (m) => m.UsuariosMainPage,
      ),
  },
];
