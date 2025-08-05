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

    return from(this.validateUser(route, state));
  }

  private async validateUser(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const termsValid = this.termsGuard.canActivate(route, state);
      const termsResult =
        termsValid instanceof Promise ? await termsValid : termsValid;
      if (!termsResult) {
        return false;
      }

      const profileValid = this.profileGuard.canActivate(route, state);
      const profileResult =
        profileValid instanceof Promise ? await profileValid : profileValid;
      if (!profileResult) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en validación de usuario:', error);
      return true;
    }
  }
}
