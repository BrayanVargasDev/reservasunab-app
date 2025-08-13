import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, from } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { ValidationCacheService } from '@auth/services/validation-cache.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { checkTermsAccepted } from '@auth/actions';

@Injectable({
  providedIn: 'root',
})
export class TermsAcceptedGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private globalLoaderService = inject(GlobalLoaderService);
  private validationCache = inject(ValidationCacheService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (state.url.includes('/auth/terms-conditions')) {
      return true;
    }

    return this.checkTerms();
  }

  private async checkTerms(): Promise<boolean> {
    try {
  const isComingFromLogin = await this.validationCache.isComingFromLogin();
  const storedTermsAccepted = await this.validationCache.getTerminosAceptados();

      if (isComingFromLogin || storedTermsAccepted === null) {
        this.globalLoaderService.show(
          'Verificando términos y condiciones...',
          'Un momento por favor',
        );

        if (!this.authService.isSessionValid()) {
          this.globalLoaderService.hide();
          this.authService.clearSession();
          this.router.navigate(['/auth/login']);
          return false;
        }

        const termsResponse = await checkTermsAccepted(
          this.authService['http'],
        );

        const termsAccepted = termsResponse.data.terminos_condiciones;

  await this.validationCache.setTerminosAceptados(termsAccepted);

        if (!termsAccepted) {
          this.globalLoaderService.hide();
          this.router.navigate(['/auth/terms-conditions']);
          return false;
        }

        this.globalLoaderService.hide();
        return true;
      } else {
        if (storedTermsAccepted === true) {
          if (!this.authService.isSessionValid()) {
            this.authService.clearSession();
            this.router.navigate(['/auth/login']);
            return false;
          }
          return true;
        } else {
          this.router.navigate(['/auth/terms-conditions']);
          return false;
        }
      }
    } catch (error) {
      console.error('Error al verificar términos:', error);
      this.globalLoaderService.hide();

      if (!this.authService.isSessionValid()) {
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
        return false;
      }

      return true;
    }
  }
}
