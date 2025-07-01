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
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const estadoAuth = this.authService.estadoAutenticacion();

    // Si está chequeando, permitir acceso temporal y esperar resolución
    if (estadoAuth === 'chequeando') {
      // Programar una verificación después de un breve delay para dar tiempo a la resolución
      setTimeout(() => {
        const nuevoEstado = this.authService.estadoAutenticacion();
        if (nuevoEstado === 'autenticado') {
          this.router.navigate(['/dashboard']);
        }
      }, 100);
      return true;
    }

    // Si está autenticado, redirigir al dashboard
    if (estadoAuth === 'autenticado') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // Si no está autenticado, permitir acceso a login/registro
    return true;
  }
}
