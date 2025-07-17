import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { PermissionService } from '@shared/services/permission.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  private permissionService = inject(PermissionService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const rutaActual = state.url;
    const puedeAcceder = this.permissionService.puedeAccederARuta(rutaActual);

    if (!puedeAcceder) {
      console.warn(`Acceso denegado a la ruta: ${rutaActual}`);
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
