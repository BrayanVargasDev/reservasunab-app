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
    // Si está autenticado y la sesión es válida, permitir acceso
    if (this.authService.isAuthenticated() && this.authService.isSessionValid()) {
      return true;
    }

    // Si no está autenticado o sesión inválida, redirigir
    this.redirectToLogin(state.url);
    return false;
  }


  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true // Reemplazar la URL actual en el historial
    });
  }
}
