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

    // Si ya está autenticado, permitir acceso inmediatamente
    if (estadoAuth === 'autenticado') {
      return true;
    }

    // Si claramente no está autenticado, redirigir inmediatamente
    if (estadoAuth === 'noAutenticado') {
      this.redirectToLogin(state.url);
      return false;
    }

    // Si está chequeando, esperar un tiempo limitado para la resolución
    if (estadoAuth === 'chequeando') {
      return this.waitForAuthResolution(state.url);
    }

    // Por defecto, no permitir acceso
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
