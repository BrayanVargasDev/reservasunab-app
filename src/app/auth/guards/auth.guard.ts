import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, map, take, timer, switchMap, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const estadoAuth = this.authService.estadoAutenticacion();

    // Si ya está autenticado por presencia de usuario + refresh válido, permitir
    if (estadoAuth === 'autenticado' && this.authService.isSessionValid()) {
      return true;
    }

    // Si está chequeando, esperar un tiempo limitado
    if (estadoAuth === 'chequeando') {
      return this.waitForAuthResolution(state.url);
    }

    // Estado noAutenticado o sesión inválida
    this.redirectToLogin(state.url);
    return false;
  }

  private waitForAuthResolution(returnUrl: string): Observable<boolean> {
    // Esperar máximo 3 segundos para que se resuelva la autenticación
    return timer(0, 100).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();

        if (estado === 'autenticado') {
          return of(true);
        }

        if (estado === 'noAutenticado') {
          this.redirectToLogin(returnUrl);
          return of(false);
        }

        // Continuar esperando
        return of(null);
      }),
      take(30), // Máximo 3 segundos (30 * 100ms)
      map(result => {
        if (result === null) {
          // Timeout: asumir no autenticado
          this.redirectToLogin(returnUrl);
          return false;
        }
        return result;
      })
    );
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true // Reemplazar la URL actual en el historial
    });
  }
}
