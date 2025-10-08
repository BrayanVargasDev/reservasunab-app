import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
// import { Browser } from '@capacitor/browser';

import { AuthService } from '@auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { MobileAuthService } from '@auth/services/mobile-auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private movbileAuthService = inject(MobileAuthService);
  private platform = inject(Platform);

  async ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const code = qp.get('code') ?? '';
    const returnUrl = qp.get('returnUrl') ?? '';
    const error = qp.get('error');
    const errorDescription = qp.get('error_description');

    // Cerrar el browser solo si tenemos un código válido
    if (
      this.platform.is('android') ||
      this.platform.is('mobile') ||
      this.platform.is('ios')
    ) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Estoy a punto de cerrar el navegador');
      await this.movbileAuthService.closeBrowser();
      // Navegar a callback-movil para procesar el token
      return this.router.navigate(['/auth/callback-movil'], {
        queryParams: { code, returnUrl, error, errorDescription },
        replaceUrl: true,
      });
    }

    try {
      // Verificar si hay errores en la respuesta de OAuth
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        return this.handleOAuthError(
          error,
          errorDescription || 'Error en autenticación SSO',
        );
      }

      // Validar que tenemos un código de autorización
      if (!code || code.trim() === '') {
        console.error('No authorization code received');
        return this.handleOAuthError(
          'no_code',
          'No se recibió código de autorización',
        );
      }

      // Intercambiar code por tokens
      const tokenPromise = await this.authService.intercambiarToken(code);

      if (!tokenPromise) {
        console.error('Token exchange failed');
        return this.handleOAuthError(
          'token_exchange_failed',
          'Error al intercambiar tokens',
        );
      }

      console.debug('Token intercambiado correctamente, redirigiendo...');

      // Decidir ruta de destino respetando lógica de términos/perfil
      const dest = await this.authService.validarTerminosYPerfil();

      if (dest && dest !== '/') {
        console.debug('Redirecting to post-login destination:', dest);
        return this.router.navigate([dest]);
      }

      if (returnUrl && returnUrl !== '/') {
        console.debug('Redirecting to return URL:', returnUrl);
        return this.router.navigate([returnUrl], { replaceUrl: true });
      }

      console.debug('Redirecting to first available page');
      return this.navigationService.navegarAPrimeraPaginaDisponible();
    } catch (e: any) {
      console.error('Error en callback OAuth:', e);
      return this.handleOAuthError(
        'unexpected_error',
        e.message || 'Error inesperado en autenticación SSO',
      );
    }
  }

  private async handleOAuthError(error: string, description: string) {
    // Limpiar cualquier estado de autenticación parcial
    this.authService.clearSession();
    this.authService.setLoading(false);
    // Redirigir al login con parámetros de error
    return this.router.navigate(['/auth/login'], {
      queryParams: {
        sso_error: error,
        sso_error_description: description,
      },
    });
  }
}
