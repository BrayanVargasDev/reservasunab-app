import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('@auth/pages/registro/registro.page').then((m) => m.RegistroPage),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('@auth/pages/reset-password/reset-password.page').then(
            (m) => m.ResetPasswordPage,
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
