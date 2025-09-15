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

  private isCheckingProfile = false;
  private lastCheckTime = 0;
  private readonly CHECK_COOLDOWN = 5000; // 5 segundos entre verificaciones

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Permitir acceso directo a la página de perfil
    if (state.url.includes('/perfil')) {
      return true;
    }

    // Evitar múltiples validaciones simultáneas
    if (this.isCheckingProfile) {
      console.debug('Profile validation already in progress, skipping duplicate check');
      return true; // Permitir acceso mientras se valida en otro lugar
    }

    return this.checkProfile();
  }

  private async checkProfile(): Promise<boolean> {
    const now = Date.now();

    // Si hay una verificación reciente, usar cache
    if (now - this.lastCheckTime < this.CHECK_COOLDOWN) {
      console.debug('Using cached profile validation result');
      try {
        const storedProfileCompleted = await this.validationCache.obtenerPerfilCompletado();
        return storedProfileCompleted === true;
      } catch {
        return true; // En caso de error, permitir acceso
      }
    }

    // Evitar múltiples verificaciones simultáneas
    if (this.isCheckingProfile) {
      console.debug('Profile validation already in progress, waiting...');
      // Esperar un poco y reintentar
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.checkProfile();
    }

    this.isCheckingProfile = true;
    this.lastCheckTime = now;

    try {
      const isComingFromLogin = await this.validationCache.isComingFromLogin();
      const storedProfileCompleted = await this.validationCache.obtenerPerfilCompletado();

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

        await this.validationCache.setPerfilCompletado(profileCompleted);

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
      console.error('Error al verificar perfil:', error);
      this.globalLoaderService.hide();

      if (!this.authService.isSessionValid()) {
        this.authService.clearSession();
        this.router.navigate(['/auth/login']);
        return false;
      }

      return true; // En caso de error, permitir acceso para evitar bloqueos
    } finally {
      this.isCheckingProfile = false;
    }
  }
}
