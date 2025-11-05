import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadComponent: () =>
          import('@auth/pages/login/login.page').then(m => m.LoginPage),
      },
      {
        path: 'callback',
        loadComponent: () =>
          import('@auth/pages/callback/callback.page').then(
            m => m.AuthCallbackPage,
          ),
      },
      {
        path: 'callback-movil',
        loadComponent: () =>
          import('@auth/pages/callback-movil/callback-movil.page').then(
            m => m.AuthCallbackMovilPage,
          ),
      },
      // {
      //   path: 'registro',
      //   canActivate: [NoAuthGuard],
      //   loadComponent: () =>
      //     import('@auth/pages/registro/registro.page').then((m) => m.RegistroPage),
      // },
      // {
      //   path: 'reset-password',
      //   loadComponent: () =>
      //     import('@auth/pages/reset-password/reset-password.page').then(
      //       (m) => m.ResetPasswordPage,
      //     ),
      // },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
