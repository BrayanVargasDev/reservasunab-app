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

    if (estadoAuth === 'chequeando') {
      setTimeout(() => {
        const nuevoEstado = this.authService.estadoAutenticacion();
        if (nuevoEstado === 'autenticado') {
          this.router.navigate(['/dashboard']);
        }
      }, 100);
      return true;
    }

    if (estadoAuth === 'autenticado') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
