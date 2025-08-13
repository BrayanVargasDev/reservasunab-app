import { Routes } from '@angular/router';
import { authRoutes } from '@auth/auth.routes';
import { AuthGuard } from './auth/guards/auth.guard';
import { AppInitGuard } from './auth/guards/app-init.guard';
import { PermissionsGuard } from './shared/guards/permissions-simple.guard';
import { ProfileCompleteGuard } from './auth/guards/profile-complete.guard';
import { TermsAcceptedGuard } from './auth/guards/terms-accepted.guard';
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
    canActivate: [AppInitGuard, AuthGuard, TermsAcceptedGuard],
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
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'home',
        loadChildren: () =>
          import('@dashboard/dashboard.routes').then(m => m.dashboardRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('@perfil/perfil.routes').then(m => m.perfilRoutes),
        canActivate: [PermissionsGuard],
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('@usuarios/usuarios.routes').then(m => m.usuariosRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'pagos',
        loadChildren: () =>
          import('@pagos/pagos.routes').then(m => m.pagosRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'permisos',
        loadChildren: () =>
          import('@permisos/permisos.routes').then(m => m.permisosRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'espacios',
        loadChildren: () =>
          import('@espacios/espacios.routes').then(m => m.espaciosRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'reservas',
        loadChildren: () =>
          import('@reservas/reservas.routes').then(m => m.dreservasRoutes),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
      },
      {
        path: 'config',
        loadChildren: () =>
          import('@configuracion/configuracion.routes').then(
            m => m.configRoutes,
          ),
        canActivate: [ProfileCompleteGuard, PermissionsGuard],
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
