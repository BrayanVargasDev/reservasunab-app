import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotFoundPage } from './shared/pages/not-found/not-found.page';
import { AccessDeniedPage } from './shared/pages/access-denied/access-denied.page';
import { MainLayoutComponent } from '@shared/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'acceso-denegado',
    component: AccessDeniedPage,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
        canActivate: [AuthGuard],
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('@perfil/perfil.routes').then((m) => m.perfilRoutes),
        canActivate: [AuthGuard],
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@usuarios/usuarios.routes').then((m) => m.usuariosRoutes),
        canActivate: [AuthGuard],
        data: { permission: 'usuarios_ver' },
      },
      {
        path: 'pagos',
        loadChildren: () =>
          import('@pagos/pagos.routes').then((m) => m.pagosRoutes),
        canActivate: [AuthGuard],
        data: { permission: 'pagos_ver' },
      },
      {
        path: 'permisos',
        loadChildren: () =>
          import('@permisos/permisos.routes').then((m) => m.permisosRoutes),
        canActivate: [AuthGuard],
        data: { permission: 'admin' },
      },
    ],
  },
  {
    path: '404',
    component: NotFoundPage,
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
