import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const estadoAuth = this.authService.estadoAutenticacion();

    if (estadoAuth === 'chequeando') {
      setTimeout(() => {
        const nuevoEstado = this.authService.estadoAutenticacion();
        if (nuevoEstado === 'autenticado') {
          this.navigationService.navegarAPrimeraPaginaDisponible();
        }
      }, 100);
      return true;
    }

    if (estadoAuth === 'autenticado') {
      this.navigationService.navegarAPrimeraPaginaDisponible();
      return false;
    }

    return true;
  }
}
