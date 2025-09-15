import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, from, of } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { TermsAcceptedGuard } from './terms-accepted.guard';
import { ProfileCompleteGuard } from './profile-complete.guard';

@Injectable({
  providedIn: 'root',
})
export class UserValidationGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private termsGuard = inject(TermsAcceptedGuard);
  private profileGuard = inject(ProfileCompleteGuard);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Si estamos en páginas de términos o perfil, permitir acceso directo
    if (state.url.includes('/auth/terms-conditions') || state.url.includes('/perfil')) {
      return true;
    }

    return from(this.validateUser(route, state));
  }

  private async validateUser(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      console.debug('UserValidationGuard: Starting validation for', state.url);

      // Verificar términos primero
      const termsValid = this.termsGuard.canActivate(route, state);
      const termsResult = termsValid instanceof Promise ? await termsValid : termsValid;

      if (!termsResult) {
        console.debug('UserValidationGuard: Terms validation failed');
        return false;
      }

      // Verificar perfil
      const profileValid = this.profileGuard.canActivate(route, state);
      const profileResult = profileValid instanceof Promise ? await profileValid : profileValid;

      if (!profileResult) {
        console.debug('UserValidationGuard: Profile validation failed');
        return false;
      }

      console.debug('UserValidationGuard: All validations passed');
      return true;
    } catch (error) {
      console.error('Error en validación de usuario:', error);
      // En caso de error, permitir acceso para evitar bloqueos
      return true;
    }
  }
}
