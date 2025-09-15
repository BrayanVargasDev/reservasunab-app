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

  private isCheckingTerms = false;
  private lastCheckTime = 0;
  private readonly CHECK_COOLDOWN = 5000; // 5 segundos entre verificaciones

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Permitir acceso directo a la página de términos
    if (state.url.includes('/auth/terms-conditions')) {
      return true;
    }

    // Evitar múltiples validaciones simultáneas
    if (this.isCheckingTerms) {
      console.debug('Terms validation already in progress, skipping duplicate check');
      return true; // Permitir acceso mientras se valida en otro lugar
    }

    return this.checkTerms();
  }

  private async checkTerms(): Promise<boolean> {
    const now = Date.now();

    // Si hay una verificación reciente, usar cache
    if (now - this.lastCheckTime < this.CHECK_COOLDOWN) {
      console.debug('Using cached terms validation result');
      try {
        const storedTermsAccepted = await this.validationCache.getTerminosAceptados();
        return storedTermsAccepted === true;
      } catch {
        return true; // En caso de error, permitir acceso
      }
    }

    // Evitar múltiples verificaciones simultáneas
    if (this.isCheckingTerms) {
      console.debug('Terms validation already in progress, waiting...');
      // Esperar un poco y reintentar
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.checkTerms();
    }

    this.isCheckingTerms = true;
    this.lastCheckTime = now;

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

        const termsResponse = await checkTermsAccepted(this.authService['http']);
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

      return true; // En caso de error, permitir acceso para evitar bloqueos
    } finally {
      this.isCheckingTerms = false;
    }
  }
}
