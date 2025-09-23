import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { AuthGuard } from './auth/guards/auth.guard';
import { AppInitGuard } from './auth/guards/app-init.guard';
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
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'home',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'perfil',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@perfil/perfil.routes').then(m => m.perfilRoutes),
      },
      {
        path: 'usuarios',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@usuarios/usuarios.routes').then(m => m.usuariosRoutes),
      },
      {
        path: 'pagos',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@pagos/pagos.routes').then(m => m.pagosRoutes),
      },
      {
        path: 'permisos',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@permisos/permisos.routes').then(m => m.permisosRoutes),
      },
      {
        path: 'espacios',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@espacios/espacios.routes').then(m => m.espaciosRoutes),
      },
      {
        path: 'reservas',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@reservas/reservas.routes').then(m => m.dreservasRoutes),
      },
      {
        path: 'config',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('@configuracion/configuracion.routes').then(
            m => m.configRoutes,
          ),
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
