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

    // Si ya está autenticado, redirigir inmediatamente
    if (estadoAuth === 'autenticado') {
      this.navigationService.navegarAPrimeraPaginaDisponible();
      return false;
    }

    // Si está chequeando, esperar resolución
    if (estadoAuth === 'chequeando') {
      return this.waitForAuthResolution();
    }

    return true;
  }

  private waitForAuthResolution(): Observable<boolean> {
    return timer(0, 100).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();

        if (estado === 'noAutenticado') {
          return of(true);
        }

        if (estado === 'autenticado') {
          this.navigationService.navegarAPrimeraPaginaDisponible();
          return of(false);
        }

        // Continuar esperando
        return of(null);
      }),
      take(30), // Máximo 3 segundos
      map(result => {
        if (result === null) {
          // Timeout: asumir no autenticado y permitir acceso
          return true;
        }
        return result;
      })
    );
  }
}
