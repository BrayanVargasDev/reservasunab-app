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
    console.log('[ProfileCompletionGuard] Verificando acceso a:', state.url);
    
    // Si no está autenticado, permitir que AuthGuard maneje eso
    if (!this.authService.isAuthenticated()) {
      console.log('[ProfileCompletionGuard] Usuario no autenticado');
      return true;
    }

    // Si la ruta actual es /auth, permitir acceso
    if (state.url.includes('/auth')) {
      console.log('[ProfileCompletionGuard] Ruta de auth, permitir');
      return true;
    }

    // Si es ruta de términos y condiciones, permitir acceso
    if (state.url.includes('/terms-conditions') || state.url.includes('/politicas')) {
      console.log('[ProfileCompletionGuard] Ruta de términos, permitir');
      return true;
    }

    try {
      // Verificar términos aceptados desde la base de datos
      console.log('[ProfileCompletionGuard] Verificando términos aceptados...');
      const termsResponse = await checkTermsAccepted(this.http);
      const termsAccepted = termsResponse.data?.terminos_condiciones || false;
      console.log('[ProfileCompletionGuard] Términos aceptados:', { termsAccepted });

      if (!termsAccepted) {
        console.log('[ProfileCompletionGuard] Términos no aceptados, redirigiendo a terms-conditions');
        // Redirigir a términos y condiciones
        this.router.navigate(['/terms-conditions'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true,
        });
        return false;
      }

      // Si la ruta actual es /perfil, permitir acceso para que pueda completarlo
      if (state.url.includes('/perfil')) {
        console.log('[ProfileCompletionGuard] Ruta de perfil, permitir (términos ya aceptados)');
        return true;
      }

      // Verificar perfil completado desde la base de datos
      console.log('[ProfileCompletionGuard] Verificando perfil completado...');
      const profileResponse = await checkProfileCompleted(this.http);
      const profileCompleted = profileResponse.data?.perfil_completo || false;
      console.log('[ProfileCompletionGuard] Perfil completado:', { profileCompleted });

      if (!profileCompleted) {
        console.log('[ProfileCompletionGuard] Perfil no completado, redirigiendo a perfil');
        // Si llegó aquí, necesita completar el perfil
        this.redirectToProfile(state.url);
        return false;
      }

      // Todo está completo, permitir navegación
      console.log('[ProfileCompletionGuard] Todo completo, permitir navegación');
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