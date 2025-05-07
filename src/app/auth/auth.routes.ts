import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./ui/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./ui/pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./ui/pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
  }
];
