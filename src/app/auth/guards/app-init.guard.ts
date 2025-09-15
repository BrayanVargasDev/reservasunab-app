import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of, timer, switchMap, take, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const estadoAuth = this.authService.estadoAutenticacion();

    // Si ya no está en estado de "chequeando", permitir navegación
    if (estadoAuth !== 'chequeando') {
      return of(true);
    }

    // Esperar hasta que el estado se resuelva con timeout mejorado
    const maxWaitTime = 4000; // 4 segundos máximo
    const checkInterval = 200; // Verificar cada 200ms
    const maxChecks = Math.ceil(maxWaitTime / checkInterval);

    return timer(0, checkInterval).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();

        if (estado !== 'chequeando') {
          return of(true);
        }

        // Si hay refresh en progreso, esperar
        if (this.authService.isRefreshInProgress()) {
          return of(null);
        }

        // Si no hay operaciones pero sigue en chequeo, forzar resolución
        this.authService.forceResolveAuthState();
        return of(true);
      }),
      filter(result => result !== null),
      take(maxChecks),
      take(1), // Asegurar que solo emita una vez
      switchMap(result => of(result as boolean))
    );
  }
}
