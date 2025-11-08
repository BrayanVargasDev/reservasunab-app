import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import {
  InAppBrowser as Browser,
  DefaultSystemBrowserOptions,
  InAppBrowserPlugin,
} from '@capacitor/inappbrowser';
import {
  SocialLogin,
  GoogleLoginResponse,
} from '@capgo/capacitor-social-login';

import { AuthService } from './auth.service';
import { AppService } from '@app/app.service';
import { NavigationService } from '@shared/services/navigation.service';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { loginGoogleAction } from '../actions';

@Injectable({
  providedIn: 'root',
})
export class MobileAuthService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private appService = inject(AppService);
  private http = inject(HttpClient);
  private environment = environment;
  private _browser = signal<InAppBrowserPlugin | null>(null);
  private platform = inject(Platform);

  constructor() {
    this._browser.set(Browser);
    
    // Hacer la configuración async sin bloquear el constructor
    this.configureGoogleOauth().catch(error => {
      console.error('Error en configureGoogleOauth():', error);
    });
  }

  private isAuthenticating = false;
  private browserClosed = signal(false);

  private async configureGoogleOauth() {
    try {
      // Detectar Safari iOS específicamente
      const isSafariIOS = this.isIOSBrowser();

      // Verificar si estamos en un navegador web (no Capacitor nativo)
      const isWebBrowser = !Capacitor.isNativePlatform();

      if (isWebBrowser) {
        // Para todos los navegadores web - configuración simple
        await SocialLogin.initialize({
          google: {
            webClientId: this.environment.googleWebId,
          },
        });
        return true;
      }

      // Para aplicaciones nativas
      if (this.platform.is('android')) {
        return await SocialLogin.initialize({
          google: {
            webClientId: this.environment.googleWebId,
          },
        });
      }

      if (this.platform.is('ios')) {
        return await SocialLogin.initialize({
          google: {
            iOSClientId: this.environment.googleIosId, // the iOS client id
            iOSServerClientId: this.environment.googleWebId,
          },
        });
      }

      // Fallback para cualquier otra plataforma
      return await SocialLogin.initialize({
        google: {
          webClientId: this.environment.googleWebId,
          redirectUrl: `${this.environment.baseUrl}/auth/callback`,
        },
      });
    } catch (configError) {
      console.error('Error en configureGoogleOauth():', configError);
      throw configError;
    }
  }

  public async loginWithGoogle() {
    try {
      // Detectar si es iOS web en general
      const isIOSWeb = /iPhone|iPad|iPod/i.test(navigator.userAgent) && !Capacitor.isNativePlatform();
      
      // Si es iOS web, usar el método específico para Safari
      if (isIOSWeb) {
        return await this.loginWithGoogleSafariIOS();
      }

      // Configurar el plugin antes de usarlo
      await this.configureGoogleOauth();

      // Para otros navegadores, usar el método normal del plugin
      const { result } = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email'],
        },
      });

      return await this.processGoogleAuthResult(result);

    } catch (err: any) {
      console.error('Error en login Google:', err);
      return false;
    }
  }

  private async processGoogleAuthResult(result: any): Promise<boolean> {
    try {
      const idToken = result.idToken ?? null;
      if (!idToken) {
        console.error('No se obtuvo un idToken del plugin. Result completo:', result);
        
        // Intentar obtener otros tokens como fallback
        const accessToken = result.accessToken;
        const authCode = result.serverAuthCode || result.authorizationCode;
        
        if (authCode) {
          throw new Error('Se obtuvo código de autorización pero se necesita configurar el intercambio en el backend');
        }
        
        throw new Error('No se obtuvo un token válido de Google');
      }

      const respuestaBackend = await loginGoogleAction(this.http, idToken);

      if (respuestaBackend.status !== 'success') {
        console.error('Error en respuesta del backend:', respuestaBackend);
        throw new Error(respuestaBackend.message || 'Error en el servidor de autenticación');
      }

      this.authService.onSuccessLogin(respuestaBackend.data);
      return true;
    } catch (error) {
      console.error('Error procesando resultado de Google Auth:', error);
      throw error;
    }
  }

  /**
   * Método específico para Safari iOS que usa redirección directa en lugar de popup
   */
  private async loginWithGoogleSafariIOS(): Promise<boolean> {
    try {
      // Construir URL de autenticación de Google manualmente
      const clientId = this.environment.googleWebId;
      const redirectUri = encodeURIComponent(`${this.environment.baseUrl}/api/google/callback`);
      const scope = encodeURIComponent('email profile openid');
      const responseType = 'code';
      const state = this.generateState();

      if (!clientId) {
        console.error('No se encontró Client ID en environment');
        return false;
      }
      
      const authUrl = `https://accounts.google.com/oauth2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `response_type=${responseType}&` +
        `state=${state}&` +
        `prompt=select_account&` +
        `access_type=offline&` +
        `include_granted_scopes=false&` +
        `nonce=${this.generateNonce()}&` +
        `hd=`;

      // Redirección con un breve delay
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);
      
      return true;

    } catch (error) {
      console.error('Error en login Google Safari iOS:', error);
      return false;
    }
  }

  /**
   * Genera un state aleatorio para OAuth
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
          Math.random().toString(36).substring(2, 15);
  }

  /**
   * Genera un nonce único para OAuth
   */
  private generateNonce(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Detecta si es Safari en iOS específicamente
   */
  private isIOSBrowser(): boolean {
    const userAgent = navigator.userAgent;
    
    // Detectar dispositivos iOS
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    
    // Verificar que no sea una app nativa de Capacitor
    const isNative = Capacitor.isNativePlatform();
    
    // Detectar Safari específicamente (no Chrome, Firefox, etc. en iOS)
    const isSafari = /Safari/i.test(userAgent) && 
                     !/CriOS|FxiOS|OPiOS|mercury|Edge/i.test(userAgent);
    
    // Alternativa más simple: detectar si es iOS web sin importar el navegador
    const isIOSWeb = isIOS && !isNative;
    
    const result = isIOSWeb && isSafari;
    
    return result;
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
   * Verifica si la URL es la de callback (normal o móvil)
   */
  private isCallbackUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname === '/api/google/callback' || urlObj.pathname === '/auth/callback' || urlObj.pathname === '/auth/callback-movil';
    } catch {
      return false;
    }
  }

  /**
   * Maneja la navegación al callback: extrae parámetros, cierra browser y redirige a la app
   */
  private async handleCallbackNavigation(url: string): Promise<void> {
    try {
      // Extraer parámetros de la URL
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      const error = urlObj.searchParams.get('error');
      const errorDescription = urlObj.searchParams.get('error_description');
      const returnUrl = urlObj.searchParams.get('returnUrl');

      // Cerrar el browser
      await (Browser as any).close();

      // Limpiar listeners
      this.cleanup();

      // Redirigir a la página de callback estándar en la app con los parámetros
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

      // Decidir ruta de destino
      const dest = await this.authService.validarTerminosYPerfil();

      if (dest && dest !== '/') {
        this.router.navigate([dest]);
      } else if (returnUrl && returnUrl !== '/') {
        this.router.navigate([returnUrl], { replaceUrl: true });
      } else {
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
  /**
   * Método público para procesar authorization code de Safari iOS
   */
  public async processAuthorizationCode(authCode: string): Promise<boolean> {
    try {
      const tokenData = await this.exchangeAuthCodeForIdToken(authCode);
      
      if (!tokenData.success) {
        console.error('No se pudo procesar authorization code:', tokenData.error);
        return false;
      }
      
      if (tokenData.idToken === 'processed_by_backend') {
        return true;
      } else if (tokenData.idToken) {
        const result = await this.processGoogleAuthResult({
          idToken: tokenData.idToken,
          provider: 'google'
        } as any);
        
        return result;
      }
      
      console.error('Estado inesperado en tokenData:', tokenData);
      return false;
      
    } catch (error) {
      console.error('Error procesando authorization code:', error);
      return false;
    }
  }

  /**
   * Intercambia authorization code por idToken usando el backend
   */
  private async exchangeAuthCodeForIdToken(authCode: string): Promise<{success: boolean, idToken?: string, error?: string}> {
    try {
      // Usar el mismo redirect_uri que está configurado en el backend
      const redirectUri = `${this.environment.baseUrl}/api/google/callback`;
      
      // Usar el endpoint unificado que maneja tanto idToken como authorization code
      const response = await this.http.post(`${this.environment.baseUrl}/api/google/callback`, {
        code: authCode,
        redirect_uri: redirectUri
      }, {
        headers: {
          'X-Frontend-Environment': this.environment.baseUrl.includes('reservas.unab.edu.co') ? 'production' : 
                                   this.environment.baseUrl.includes('reservasunab.wgsoluciones.com') ? 'pruebas' : 'development'
        }
      }).toPromise();
      
      if (response && (response as any).status === 'success') {
        // El backend ya procesó completamente la autenticación
        this.authService.onSuccessLogin((response as any).data);
        
        return {
          success: true,
          idToken: 'processed_by_unified_endpoint'
        };
      } else {
        return {
          success: false,
          error: (response as any)?.message || 'Respuesta del backend no exitosa'
        };
      }
      
    } catch (error) {
      console.error('Error intercambiando con backend:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Envía el authorization code al backend para intercambio
   */
  private async exchangeCodeViaBackend(authCode: string): Promise<boolean> {
    try {
      const payload = {
        code: authCode,
        redirect_uri: `${this.environment.baseUrl}/api/google/callback`
      };
      
      // Intentar con el endpoint específico para authorization codes
      const response = await this.http.post(`${this.environment.baseUrl}/api/google/exchange-code`, payload).toPromise();
      
      if (response && (response as any).status === 'success') {
        this.authService.onSuccessLogin((response as any).data);
        return true;
      } else {
        console.error('Respuesta del backend no exitosa:', response);
        return false;
      }
      
    } catch (error) {
      console.error('Error enviando code al backend:', error);
      
      // Si el endpoint específico no existe, usar el método existente
      try {
        const fallback = await this.authService.intercambiarToken(authCode);
        return fallback;
      } catch (fallbackError) {
        console.error('Error en método fallback:', fallbackError);
        return false;
      }
    }
  }

  async cancelAuthentication(): Promise<void> {
    if (this.isAuthenticating) {
      await (Browser as any).close();
      this.cleanup();
    }
  }
}
