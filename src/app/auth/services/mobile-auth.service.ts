import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import {
  InAppBrowser as Browser,
  DefaultSystemBrowserOptions,
  InAppBrowserPlugin,
} from '@capacitor/inappbrowser';

import { AuthService } from './auth.service';
import { AppService } from '@app/app.service';
import { NavigationService } from '@shared/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class MobileAuthService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private appService = inject(AppService);
  private _browser = signal<InAppBrowserPlugin | null>(null);

  constructor() {
    this._browser.set(Browser);
  }

  private isAuthenticating = false;
  private browserClosed = signal(false);

  /**
   * Inicia el flujo de autenticación SAML en móvil usando InAppBrowser
   */
  async loginWithSaml(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      throw new Error('Este método solo funciona en plataformas nativas');
    }

    if (this.isAuthenticating) {
      console.warn('Ya hay una autenticación en progreso');
      return;
    }

    try {
      this.isAuthenticating = true;
      this.browserClosed.set(false);
      this.authService.setLoading(true);

      const samlUrl = `${this.appService.samlUrl}/api/saml/${this.appService.tenantId}/login`;

      if (!samlUrl || !this.appService.samlUrl || !this.appService.tenantId) {
        throw new Error('Configuración de SSO incompleta');
      }

      // Limpiar cualquier estado anterior
      this.authService.clearSession();

      await this._browser()?.openInSystemBrowser({
        url: samlUrl,
        options: DefaultSystemBrowserOptions,
      });

      await this._browser()?.addListener('browserClosed', () => {
        this.browserClosed.set(true);
      });
    } catch (error) {
      console.error('Error iniciando autenticación móvil:', error);
      this.isAuthenticating = false;
      this.authService.setLoading(false);
      throw error;
    }
  }

  public getBrowser() {
    return this._browser();
  }

  /**
   * Cierra el browser si no ha sido cerrado aún
   */
  async closeBrowser(): Promise<void> {
    if (!this.browserClosed()) {
      await this.getBrowser()?.close();
      this.browserClosed.set(true);
    }
  }

  /**
   * Verifica si la URL es la de callback
   */
  private isCallbackUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname === '/auth/callback';
    } catch {
      return false;
    }
  }

  /**
   * Maneja la navegación al callback: extrae parámetros, cierra browser y redirige a la app
   */
  private async handleCallbackNavigation(url: string): Promise<void> {
    try {
      alert('Interceptando callback URL: ' + url);

      // Extraer parámetros de la URL
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      const error = urlObj.searchParams.get('error');
      const errorDescription = urlObj.searchParams.get('error_description');
      const returnUrl = urlObj.searchParams.get('returnUrl');

      alert('Parámetros extraídos - code: ' + code + ', error: ' + error);

      // Cerrar el browser
      await (Browser as any).close();

      alert('Browser cerrado, redirigiendo a /auth/callback');

      // Limpiar listeners
      this.cleanup();

      // Redirigir a la página de callback en la app con los parámetros
      this.router.navigate(['/auth/callback'], {
        queryParams: {
          code,
          error,
          error_description: errorDescription,
          returnUrl,
        },
      });
    } catch (error) {
      console.error('Error procesando callback:', error);
      alert('Error en handleCallbackNavigation: ' + error);
      this.cleanup();
      // Redirigir a login con error
      this.router.navigate(['/auth/login'], {
        queryParams: {
          sso_error: 'unexpected_error',
          sso_error_description: 'Error procesando autenticación móvil',
        },
      });
    }
  }

  /**
   * Procesa los parámetros del callback y continúa el flujo de autenticación
   */
  private async processCallback(
    code: string | null,
    error: string | null,
    errorDescription: string | null,
    returnUrl: string | null,
  ): Promise<void> {
    try {
      // Verificar errores
      if (error) {
        console.error('OAuth error en móvil:', error, errorDescription);
        this.router.navigate(['/auth/login'], {
          queryParams: {
            sso_error: error,
            sso_error_description:
              errorDescription || 'Error en autenticación SSO móvil',
          },
        });
        return;
      }

      // Validar código
      if (!code || code.trim() === '') {
        console.error('No authorization code received en móvil');
        this.router.navigate(['/auth/login'], {
          queryParams: {
            sso_error: 'no_code',
            sso_error_description: 'No se recibió código de autorización',
          },
        });
        return;
      }

      console.debug(
        'Procesando código de autorización en móvil:',
        code.substring(0, 10) + '...',
      );

      // Intercambiar token
      const success = await this.authService.intercambiarToken(code);

      if (!success) {
        console.error('Token exchange failed en móvil');
        this.authService.setLoading(false);
        this.router.navigate(['/auth/login'], {
          queryParams: {
            sso_error: 'token_exchange_failed',
            sso_error_description: 'Error al intercambiar tokens',
          },
          replaceUrl: true,
        });
        return;
      }

      console.debug(
        'Token intercambiado correctamente en móvil, redirigiendo...',
      );

      // Decidir ruta de destino
      const dest = await this.authService.validarTerminosYPerfil();

      if (dest && dest !== '/') {
        console.debug('Redirecting to post-login destination:', dest);
        this.router.navigate([dest]);
      } else if (returnUrl && returnUrl !== '/') {
        console.debug('Redirecting to return URL:', returnUrl);
        this.router.navigate([returnUrl], { replaceUrl: true });
      } else {
        console.debug('Redirecting to first available page');
        // Importar dinámicamente para evitar dependencias circulares
        const { NavigationService } = await import(
          '@shared/services/navigation.service'
        );
        const navigationService = inject(NavigationService);
        navigationService.navegarAPrimeraPaginaDisponible();
      }
    } catch (error) {
      console.error('Error en proceso de callback móvil:', error);
      this.router.navigate(['/auth/login'], {
        queryParams: {
          sso_error: 'unexpected_error',
          sso_error_description: 'Error inesperado en autenticación móvil',
        },
      });
    } finally {
      this.isAuthenticating = false;
      this.authService.setLoading(false);
    }
  }

  /**
   * Limpia listeners y estado
   */
  private cleanup(): void {
    this.isAuthenticating = false;
    this.authService.setLoading(false);

    try {
      (Browser as any).removeAllListeners();
    } catch {}
  }

  /**
   * Cancela la autenticación en progreso
   */
  async cancelAuthentication(): Promise<void> {
    if (this.isAuthenticating) {
      await (Browser as any).close();
      this.cleanup();
    }
  }
}
