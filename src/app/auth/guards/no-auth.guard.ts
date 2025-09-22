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
    // Si está autenticado y sesión válida, redirigir a página principal
    if (this.authService.isAuthenticated() && this.authService.isSessionValid()) {
      this.navigationService.navegarAPrimeraPaginaDisponible();
      return false;
    }

    // Si no está autenticado o sesión inválida, permitir acceso a rutas públicas
    return true;
  }

}
