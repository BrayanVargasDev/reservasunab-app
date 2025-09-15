import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, timer, switchMap, take, map } from 'rxjs';
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
  ): Observable<boolean> | boolean {
    const estadoAuth = this.authService.estadoAutenticacion();

    // Si claramente no está autenticado, permitir acceso a rutas públicas
    if (estadoAuth === 'noAutenticado') {
      return true;
    }

    // Si ya está autenticado y sesión válida, redirigir
    if (estadoAuth === 'autenticado' && this.authService.isSessionValid()) {
      this.navigationService.navegarAPrimeraPaginaDisponible();
      return false;
    }

    // Si está chequeando, esperar resolución
    if (estadoAuth === 'chequeando') {
      return this.waitForAuthResolution();
    }

    // Por defecto, permitir acceso (rutas públicas)
    return true;
  }

  private waitForAuthResolution(): Observable<boolean> {
    const maxWaitTime = 3000; // 3 segundos máximo
    const checkInterval = 200; // Verificar cada 200ms
    const maxChecks = Math.ceil(maxWaitTime / checkInterval);

    return timer(0, checkInterval).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();

        if (estado === 'noAutenticado') {
          return of(true);
        }

        if (estado === 'autenticado' && this.authService.isSessionValid()) {
          this.navigationService.navegarAPrimeraPaginaDisponible();
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
            this.navigationService.navegarAPrimeraPaginaDisponible();
            return of(false);
          } else {
            return of(true); // Permitir acceso a rutas públicas
          }
        }

        // Continuar esperando
        return of(null);
      }),
      take(maxChecks),
      map(result => {
        if (result === null) {
          // Timeout: forzar resolución y asumir no autenticado (permitir acceso público)
          console.warn('Auth resolution timeout in NoAuthGuard, allowing access');
          this.authService.forceResolveAuthState();
          return true;
        }
        return result;
      })
    );
  }
}
