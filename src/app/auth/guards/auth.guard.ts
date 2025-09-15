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

    // Si ya está autenticado y la sesión es válida, permitir acceso
    if (estadoAuth === 'autenticado' && this.authService.isSessionValid()) {
      return true;
    }

    // Si está chequeando, esperar resolución con timeout mejorado
    if (estadoAuth === 'chequeando') {
      return this.waitForAuthResolution(state.url);
    }

    // Si no está autenticado o sesión inválida, redirigir
    if (estadoAuth === 'noAutenticado' || !this.authService.isSessionValid()) {
      this.redirectToLogin(state.url);
      return false;
    }

    // Estado por defecto: denegar acceso
    this.redirectToLogin(state.url);
    return false;
  }

  private waitForAuthResolution(returnUrl: string): Observable<boolean> {
    const maxWaitTime = 5000; // 5 segundos máximo
    const checkInterval = 200; // Verificar cada 200ms
    const maxChecks = Math.ceil(maxWaitTime / checkInterval);

    return timer(0, checkInterval).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();

        // Si está autenticado y sesión válida, permitir
        if (estado === 'autenticado' && this.authService.isSessionValid()) {
          return of(true);
        }

        // Si no está autenticado, redirigir
        if (estado === 'noAutenticado') {
          this.redirectToLogin(returnUrl);
          return of(false);
        }

        // Si hay refresh en progreso, esperar un poco más
        if (this.authService.isRefreshInProgress()) {
          return of(null); // Continuar esperando
        }

        // Si no hay operaciones en vuelo pero sigue en chequeo, forzar resolución
        if (estado === 'chequeando') {
          this.authService.forceResolveAuthState();
          const newEstado = this.authService.estadoAutenticacion();

          if (newEstado === 'autenticado' && this.authService.isSessionValid()) {
            return of(true);
          } else {
            this.redirectToLogin(returnUrl);
            return of(false);
          }
        }

        // Continuar esperando
        return of(null);
      }),
      take(maxChecks),
      map(result => {
        if (result === null) {
          // Timeout: forzar resolución y asumir no autenticado
          console.warn('Auth resolution timeout, forcing resolution');
          this.authService.forceResolveAuthState();

          if (this.authService.estadoAutenticacion() === 'autenticado' && this.authService.isSessionValid()) {
            return true;
          } else {
            this.redirectToLogin(returnUrl);
            return false;
          }
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
