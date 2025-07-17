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

    // Esperar hasta que el estado se resuelva o timeout
    return timer(0, 100).pipe(
      switchMap(() => {
        const estado = this.authService.estadoAutenticacion();
        return estado !== 'chequeando' ? of(true) : of(null);
      }),
      filter(result => result !== null),
      take(1),
      switchMap(result => of(result as boolean))
    );
  }
}
