import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const estadoAuth = this.authService.estadoAutenticacion();

    // Si está chequeando, permitir (la verificación se hará automáticamente)
    if (estadoAuth === 'chequeando') {
      return true;
    }

    // Si no está autenticado, redirigir al login
    if (estadoAuth === 'noAutenticado') {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    return true;
  }
}
