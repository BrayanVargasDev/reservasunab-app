import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionService } from '@shared/services/permission.service';
import { AuthService } from '@auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  private permissionService = inject(PermissionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const rutaActual = state.url;

    // Si no está autenticado, permitir acceso (manejo por AuthGuard)
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    const puedeAcceder = this.permissionService.puedeAccederARuta(rutaActual);

    if (!puedeAcceder) {
      console.warn(`❌ Acceso denegado a la ruta: ${rutaActual}`);
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
