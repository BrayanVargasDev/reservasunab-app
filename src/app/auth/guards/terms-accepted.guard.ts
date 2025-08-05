import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, from } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { checkTermsAccepted } from '@auth/actions';

@Injectable({
  providedIn: 'root',
})
export class TermsAcceptedGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private globalLoaderService = inject(GlobalLoaderService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Si estamos navegando a términos y condiciones, no validar (evitar bucle)
    if (state.url.includes('/auth/terms-conditions')) {
      return true;
    }

    return this.checkTerms();
  }

  private async checkTerms(): Promise<boolean> {
    try {
      this.globalLoaderService.show(
        'Verificando términos y condiciones...',
        'Un momento por favor',
      );

      const termsResponse = await checkTermsAccepted(this.authService['http']);

      if (!termsResponse.data.terminos_condiciones) {
        this.globalLoaderService.hide();
        this.router.navigate(['/auth/terms-conditions']);
        return false;
      }

      this.globalLoaderService.hide();
      return true;
    } catch (error) {
      console.error('Error al verificar términos:', error);
      this.globalLoaderService.hide();
      // En caso de error, permitir acceso
      return true;
    }
  }
}
