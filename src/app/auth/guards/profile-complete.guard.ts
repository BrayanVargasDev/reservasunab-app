import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { ValidationCacheService } from '@auth/services/validation-cache.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { checkProfileCompleted } from '@auth/actions';

@Injectable({
  providedIn: 'root',
})
export class ProfileCompleteGuard implements CanActivate {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private globalLoaderService = inject(GlobalLoaderService);
  private validationCache = inject(ValidationCacheService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (state.url.includes('/perfil')) {
      return true;
    }

    return this.checkProfile();
  }

  private async checkProfile(): Promise<boolean> {
    try {
      const isComingFromLogin = this.validationCache.isComingFromLogin();
      const storedProfileCompleted =
        this.validationCache.obtenerPerfilCompletado();

      if (isComingFromLogin || storedProfileCompleted === null) {
        this.globalLoaderService.show(
          'Verificando perfil...',
          'Validando información del usuario',
        );

        if (!this.authService.isSessionValid()) {
          this.globalLoaderService.hide();
          this.authService.clearSession();
          this.router.navigate(['/auth/login']);
          return false;
        }

        const profileResponse = await checkProfileCompleted(this.http);

        const profileCompleted = profileResponse.data.perfil_completo;

        this.validationCache.setPerfilCompletado(profileCompleted);

        if (!profileCompleted) {
          this.globalLoaderService.hide();
          this.router.navigate(['/perfil'], {
            queryParams: { completeProfile: true },
          });
          return false;
        }

        this.globalLoaderService.hide();
        return true;
      } else {
        if (storedProfileCompleted === true) {
          if (!this.authService.isSessionValid()) {
            this.authService.clearSession();
            this.router.navigate(['/auth/login']);
            return false;
          }
          return true;
        } else {
          this.router.navigate(['/perfil'], {
            queryParams: { completeProfile: true },
          });
          return false;
        }
      }
    } catch (error) {
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
