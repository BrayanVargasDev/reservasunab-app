import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AppService } from '@app/app.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  private authService = inject(AuthService);
  private appService = inject(AppService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const usuario = this.authService.usuario();

    if (!usuario) {
      return true;
    }

    if (usuario.rol?.nombre?.toLowerCase() === 'administrador') {
      return true;
    }

    const pantallas = this.appService.pantallasQuery.data();
    if (!pantallas) {
      return true;
    }

    const rutaActual = state.url;

    let pantallaCorrespondiente = pantallas.find(
      pantalla => pantalla.ruta === rutaActual,
    );

    if (!pantallaCorrespondiente) {
      pantallaCorrespondiente = pantallas.find(
        pantalla =>
          rutaActual.startsWith(pantalla.ruta) && pantalla.ruta !== '/',
      );
    }

    if (!pantallaCorrespondiente) {
      return true;
    }

    const permisosUsuario = usuario.permisos || [];
    const tienePermiso = permisosUsuario.some(
      permiso => permiso.id_pantalla === pantallaCorrespondiente.id_pantalla,
    );

    if (!tienePermiso) {
      console.warn(
        `Acceso denegado a la ruta: ${rutaActual}. Usuario sin permisos para la pantalla: ${pantallaCorrespondiente.nombre}`,
      );
      this.router.navigate(['/acceso-denegado']);
      return false;
    }

    return true;
  }
}
