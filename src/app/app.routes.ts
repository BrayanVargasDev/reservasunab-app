import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { AuthGuard } from './auth/guards/auth.guard';
import { PermissionsGuard } from './shared/guards/permissions-simple.guard';
import { NotFoundPage } from './shared/pages/not-found/not-found.page';
import { AccessDeniedPage } from './shared/pages/access-denied/access-denied.page';
import { MainLayoutComponent } from '@shared/main-layout/main-layout.component';
import { RedirectComponent } from '@shared/components/redirect/redirect.component';

export const routes: Routes = [
  // Rutas públicas (sin autenticación) - DEBEN IR PRIMERO
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'acceso-denegado',
    component: AccessDeniedPage,
  },
  {
    path: 'pagos/reservas',
    loadComponent: () =>
      import('@pagos/pages/pago-redirect/pago-redirect.page').then(
        m => m.PagoRedirectPage,
      ),
  },
  // Rutas con autenticación y layout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RedirectComponent,
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then(m => m.dashboardRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'home',
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then(m => m.dashboardRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('@perfil/perfil.routes').then(m => m.perfilRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@usuarios/usuarios.routes').then(m => m.usuariosRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'pagos',
        loadChildren: () =>
          import('@pagos/pagos.routes').then(m => m.pagosRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'permisos',
        loadChildren: () =>
          import('@permisos/permisos.routes').then(m => m.permisosRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'espacios',
        loadChildren: () =>
          import('@espacios/espacios.routes').then(m => m.espaciosRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'reservas',
        loadChildren: () =>
          import('@reservas/reservas.routes').then(m => m.dreservasRoutes),
        canActivate: [AuthGuard, PermissionsGuard],
      },
      {
        path: 'config',
        loadChildren: () =>
          import('@configuracion/configuracion.routes').then(
            m => m.configRoutes,
          ),
        canActivate: [AuthGuard, PermissionsGuard],
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
