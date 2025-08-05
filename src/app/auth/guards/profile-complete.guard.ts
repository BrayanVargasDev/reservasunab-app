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
import { checkProfileCompleted } from '@auth/actions';

@Injectable({
  providedIn: 'root',
})
export class ProfileCompleteGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);
  private globalLoaderService = inject(GlobalLoaderService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Si estamos navegando a la ruta de perfil, no validar (evitar bucle)
    if (state.url.includes('/perfil')) {
      return true;
    }

    return this.checkProfile();
  }

  private async checkProfile(): Promise<boolean> {
    try {
      this.globalLoaderService.show(
        'Verificando perfil...',
        'Validando información del usuario',
      );

      const profileResponse = await checkProfileCompleted(
        this.authService['http'],
      );

      if (!profileResponse.data.perfil_completo) {
        this.globalLoaderService.hide();
        this.router.navigate(['/perfil'], {
          queryParams: { completeProfile: true },
        });
        return false;
      }

      this.globalLoaderService.hide();
      return true;
    } catch (error) {
      console.error('Error al verificar perfil:', error);
      this.globalLoaderService.hide();
      // En caso de error, permitir acceso
      return true;
    }
  }
}
