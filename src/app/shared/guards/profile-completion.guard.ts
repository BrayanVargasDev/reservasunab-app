import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { PerfilService } from '@app/perfil/services/perfil.service';
import { checkTermsAccepted, checkProfileCompleted } from '@app/auth/actions';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfileCompletionGuard implements CanActivate {
  private authService = inject(AuthService);
  private perfilService = inject(PerfilService);
  private router = inject(Router);
  private http = inject(HttpClient);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    // Si no está autenticado, permitir que AuthGuard maneje eso
    if (!this.authService.isAuthenticated()) {
      return true;
    }

    // Si la ruta actual es /auth, permitir acceso
    if (state.url.includes('/auth')) {
      return true;
    }

    // Si es ruta de términos y condiciones, permitir acceso
    if (state.url.includes('/terms-conditions') || state.url.includes('/politicas')) {
      return true;
    }

    try {
      // Verificar términos aceptados desde la base de datos
      const termsResponse = await checkTermsAccepted(this.http);
      const termsAccepted = termsResponse.data?.terminos_condiciones || false;
      if (!termsAccepted) {
        // Redirigir a términos y condiciones
        this.router.navigate(['/terms-conditions'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true,
        });
        return false;
      }

      // Si la ruta actual es /perfil, permitir acceso para que pueda completarlo
      if (state.url.includes('/perfil')) {
        return true;
      }

      // Verificar perfil completado desde la base de datos
      const profileResponse = await checkProfileCompleted(this.http);
      const profileCompleted = profileResponse.data?.perfil_completo || false;

      if (!profileCompleted) {
        // Si llegó aquí, necesita completar el perfil
        this.redirectToProfile(state.url);
        return false;
      }

      // Todo está completo, permitir navegación
      return true;
    } catch (error) {
      console.error('[ProfileCompletionGuard] Error al verificar estados del usuario:', error);
      // En caso de error, redirigir a términos para estar seguros
      this.router.navigate(['/terms-conditions'], {
        queryParams: { returnUrl: state.url },
        replaceUrl: true,
      });
      return false;
    }
  }

  private redirectToProfile(returnUrl: string): void {
    this.router.navigate(['/perfil'], {
      queryParams: { 
        completeProfile: 'true',
        returnUrl: returnUrl 
      },
      replaceUrl: true,
    });
  }
}