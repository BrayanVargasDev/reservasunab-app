import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
