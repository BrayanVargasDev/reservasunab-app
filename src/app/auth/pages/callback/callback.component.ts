import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { AuthService } from '@auth/services/auth.service';
import { MobileAuthService } from '@auth/services/mobile-auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { loginGoogleAction } from '@auth/actions';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent {
  private globalLoaderService = inject(GlobalLoaderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private mobileAuthService = inject(MobileAuthService);
  private navigationService = inject(NavigationService);

  // reaccionar a los parámetros en la ruta y hacer una petición con el código que viene en la ruta
  ngOnInit() {
    // 🔄 LOGS PERSISTENTES - para que no se pierdan al cambiar de página
    const logKey = 'callback_debug_logs';
    const addPersistentLog = (message: string) => {
      try {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        console.log(logEntry);
        
        const existingLogs = JSON.parse(localStorage.getItem(logKey) || '[]');
        existingLogs.push(logEntry);
        localStorage.setItem(logKey, JSON.stringify(existingLogs.slice(-20))); // Mantener últimos 20
      } catch (error) {
        console.error('Error guardando log persistente:', error);
      }
    };

    addPersistentLog('🔄🔄🔄 CALLBACK COMPONENT INICIALIZANDO 🔄🔄🔄');
    addPersistentLog(`URL actual: ${window.location.href}`);
    addPersistentLog(`Search params: ${window.location.search}`);
    
    console.log('🔄 CALLBACK COMPONENT INICIALIZANDO...');
    console.log('🔄 URL actual:', window.location.href);
    console.log('🔄 Search params:', window.location.search);
    
    this.route.queryParams.subscribe(async params => {
      addPersistentLog('🔍 Callback params recibidos');
      addPersistentLog(`Params keys: ${Object.keys(params).join(', ')}`);
      
      console.log('🔍 Callback recibido con parámetros:', params);
      console.log('🔍 Params keys:', Object.keys(params));
      console.log('🔍 Params values:', Object.values(params));
      
      const code = params['code'];
      const error = params['error'];
      const errorDescription = params['error_description'];
      const state = params['state'];

      addPersistentLog(`Code presente: ${!!code}`);
      addPersistentLog(`Code completo: ${code}`);
      addPersistentLog(`Code empieza con 4/: ${code ? code.startsWith('4/') : false}`);
      addPersistentLog(`Code length: ${code ? code.length : 0}`);

      console.log('🔍 Parámetros extraídos:', {
        code: code ? `${code.substring(0, 20)}...` : 'NO DISPONIBLE',
        codeComplete: code, // MOSTRAR EL CÓDIGO COMPLETO
        codeType: typeof code,
        codeStartsWith4: code ? code.startsWith('4/') : false,
        error: error || 'Sin error',
        errorDescription: errorDescription || 'Sin descripción de error',
        state: state ? `${state.substring(0, 10)}...` : 'NO DISPONIBLE'
      });

      this.globalLoaderService.show();

      try {
        // Manejar errores de OAuth
        if (error) {
          addPersistentLog(`❌ Error OAuth: ${error} - ${errorDescription}`);
          console.error('❌ Error en OAuth callback:', error, errorDescription);
          this.handleAuthError(`Error de autenticación: ${errorDescription || error}`);
          return;
        }

        // Validar que tenemos un código de autorización
        if (!code) {
          addPersistentLog('❌ No authorization code recibido');
          console.error('❌ No se recibió authorization code');
          this.handleAuthError('No se recibió código de autorización de Google');
          return;
        }

        addPersistentLog('✅ Authorization code recibido - iniciando procesamiento');
        addPersistentLog(`✅ Código antes de procesar: ${code}`);
        addPersistentLog(`✅ ¿Empieza con 4/?: ${code.startsWith('4/')}`);
        
        console.log('✅ Authorization code recibido, procesando...');
        console.log('✅ Código completo antes de procesar:', code);
        console.log('✅ Código empieza con "4/"?:', code.startsWith('4/'));
        console.log('✅ Longitud del código:', code.length);
        
        // AGREGAR PAUSA DE 3 SEGUNDOS PARA VER LOGS
        addPersistentLog('⏰ Esperando 3 segundos para revisar logs...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        addPersistentLog('⏰ Continuando con procesamiento...');
        
        // Intercambiar el authorization code por idToken a través del backend
        const success = await this.exchangeCodeForToken(code);
        
        if (success) {
          console.log('✅ Autenticación exitosa, redirigiendo...');
          await this.redirectAfterAuth();
        } else {
          console.error('❌ Falló el intercambio de tokens');
          this.handleAuthError('Error procesando autenticación con Google');
        }

      } catch (error) {
        console.error('❌ Error inesperado en callback:', error);
        this.handleAuthError('Error inesperado durante la autenticación');
      } finally {
        this.globalLoaderService.hide();
      }
    });
  }

  /**
   * Intercambia el authorization code por un token mediante el backend
   */
  private async exchangeCodeForToken(code: string): Promise<boolean> {
    // LOGS PERSISTENTES
    const logKey = 'callback_debug_logs';
    const addPersistentLog = (message: string) => {
      try {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        console.log(logEntry);
        
        const existingLogs = JSON.parse(localStorage.getItem(logKey) || '[]');
        existingLogs.push(logEntry);
        localStorage.setItem(logKey, JSON.stringify(existingLogs.slice(-20)));
      } catch (error) {
        console.error('Error guardando log persistente:', error);
      }
    };

    try {
      addPersistentLog('🔄🔄🔄 INTERCAMBIO DE TOKEN INICIADO 🔄🔄🔄');
      addPersistentLog(`Código recibido: ${code.substring(0, 30)}...`);
      addPersistentLog(`Longitud: ${code.length}`);
      
      console.log('🔄🔄🔄 INTERCAMBIO DE TOKEN INICIADO 🔄🔄🔄');
      console.log('🔄 Authorization code recibido:', code.substring(0, 30) + '...');
      console.log('🔄 Longitud del código:', code.length);
      console.log('🔄 Environment baseUrl:', environment.baseUrl);
      
      // DETECCIÓN SIMPLIFICADA Y FORZADA
      const isGoogleOAuthCode = code.startsWith('4/');
      
      addPersistentLog(`🔄 ¿Código empieza con "4/"?: ${isGoogleOAuthCode}`);
      addPersistentLog(`🔄 Primeros 10 caracteres: ${code.substring(0, 10)}`);
      
      console.log('🔄🔄🔄 DETECCIÓN SIMPLIFICADA 🔄🔄🔄');
      console.log('🔄 ¿Código empieza con "4/"?:', isGoogleOAuthCode);
      console.log('🔄 Primeros 10 caracteres:', code.substring(0, 10));
      
      if (isGoogleOAuthCode) {
        addPersistentLog('🍎🍎🍎 CÓDIGO GOOGLE OAUTH DETECTADO 🍎🍎🍎');
        addPersistentLog('🍎 Endpoint: /api/google/exchange-code');
        
        console.log('🍎🍎🍎 CÓDIGO GOOGLE OAUTH DETECTADO - USANDO ENDPOINT ESPECÍFICO 🍎🍎🍎');
        console.log('🍎 Razón: Código empieza con "4/"');
        console.log('🍎 Endpoint que se usará: /api/google/exchange-code');
        
        try {
          // FORZAR EL USO DEL ENDPOINT ESPECÍFICO PARA GOOGLE
          addPersistentLog('🍎 Llamando mobileAuthService.processAuthorizationCode...');
          console.log('🍎 Llamando mobileAuthService.processAuthorizationCode...');
          const googleSuccess = await this.mobileAuthService.processAuthorizationCode(code);
          
          addPersistentLog(`🍎 Resultado: ${googleSuccess ? 'ÉXITO' : 'FALLO'}`);
          console.log('🍎 Resultado método Google OAuth:', googleSuccess);
          
          if (googleSuccess) {
            addPersistentLog('🍎✅ ÉXITO CON ENDPOINT GOOGLE OAUTH');
            console.log('🍎✅ ÉXITO CON ENDPOINT GOOGLE OAUTH');
            return true;
          } else {
            addPersistentLog('🍎❌ FALLÓ ENDPOINT GOOGLE OAUTH');
            console.error('🍎❌ FALLÓ ENDPOINT GOOGLE OAUTH');
            return false;
          }
        } catch (googleError) {
          addPersistentLog(`🍎❌ ERROR EN ENDPOINT GOOGLE: ${googleError instanceof Error ? googleError.message : 'Error desconocido'}`);
          console.error('🍎❌ ERROR EN ENDPOINT GOOGLE OAUTH:', googleError);
          console.error('🍎❌ Stack trace:', googleError instanceof Error ? googleError.stack : 'No stack');
          return false;
        }
      }
      
      // SOLO para códigos que NO empiecen con "4/" (códigos internos del sistema)
      addPersistentLog('🔄🔄🔄 CÓDIGO INTERNO DEL SISTEMA 🔄🔄🔄');
      addPersistentLog('🔄 Endpoint: /api/intercambiar');
      
      console.log('🔄🔄🔄 CÓDIGO INTERNO DEL SISTEMA - USANDO ENDPOINT INTERNO 🔄🔄🔄');
      console.log('🔄 Razón: Código NO empieza con "4/"');
      console.log('🔄 Endpoint que se usará: /api/intercambiar');
      
      try {
        const success = await this.authService.intercambiarToken(code);
        addPersistentLog(`🔄 Resultado interno: ${success ? 'ÉXITO' : 'FALLO'}`);
        console.log('🔄 Resultado intercambiarToken (método interno):', success);
        
        if (success) {
          console.log('🔄✅ ÉXITO CON ENDPOINT INTERNO');
          return true;
        } else {
          console.error('🔄❌ FALLÓ ENDPOINT INTERNO');
          return false;
        }
      } catch (intercambiarError) {
        addPersistentLog(`🔄❌ ERROR EN ENDPOINT INTERNO: ${intercambiarError instanceof Error ? intercambiarError.message : 'Error desconocido'}`);
        console.error('🔄❌ ERROR EN ENDPOINT INTERNO:', intercambiarError);
        console.error('🔄❌ Error message:', intercambiarError instanceof Error ? intercambiarError.message : 'No message');
        return false;
      }

    } catch (error) {
      addPersistentLog(`❌❌❌ ERROR GENERAL: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('❌❌❌ ERROR GENERAL INTERCAMBIANDO CÓDIGO ❌❌❌');
      console.error('❌ Error:', error);
      console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack');
      return false;
    }
  }

  /**
   * Método específico para intercambiar código de Google con el backend
   */
  private async exchangeGoogleCode(code: string): Promise<boolean> {
    try {
      console.log('🔄 ENVIANDO AUTHORIZATION CODE DIRECTAMENTE AL BACKEND');
      console.log('🔄 Code:', code.substring(0, 30) + '...');
      
      // Crear un endpoint específico que maneje authorization codes
      // Por ahora, vamos a intentar enviarlo como si fuera un idToken para ver qué pasa
      console.log('🔄 Intentando enviar code como idToken para diagnóstico...');
      
      const payload = {
        idToken: code  // Esto va a fallar, pero nos dará información
      };
      
      console.log('🔄 Enviando al endpoint:', `${environment.baseUrl}/api/google/callback`);
      
      const response = await firstValueFrom(this.http.post(`${environment.baseUrl}/api/google/callback`, payload));
      
      console.log('🔄 Respuesta del servidor:', response);
      
      if (response) {
        console.log('✅ Respuesta exitosa del servidor');
        this.authService.onSuccessLogin(response as any);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ ERROR esperado (code no es idToken):', error);
      
      // Log detallado del error para diagnóstico
      if ((error as any)?.error) {
        console.log('📋 Error del servidor:', (error as any).error);
        console.log('📋 Status:', (error as any).status);
        console.log('📋 Message:', (error as any).message);
      }
      
      // Ahora intentamos con un endpoint personalizado si el backend lo tiene
      return this.tryCustomCodeEndpoint(code);
    }
  }

  /**
   * Intenta enviar el code a un endpoint personalizado
   */
  private async tryCustomCodeEndpoint(code: string): Promise<boolean> {
    try {
      console.log('🔄 INTENTANDO ENDPOINT PERSONALIZADO PARA AUTHORIZATION CODE');
      
      const payload = {
        code: code,
        redirect_uri: `${environment.baseUrl}/auth/callback`
      };
      
      // Intentar varios endpoints posibles
      const endpoints = [
        '/api/google/exchange-code',
        '/api/auth/google/code',
        '/api/google/code'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Probando endpoint: ${environment.baseUrl}${endpoint}`);
          
          const response = await firstValueFrom(
            this.http.post(`${environment.baseUrl}${endpoint}`, payload)
          );
          
          console.log(`✅ Respuesta exitosa de ${endpoint}:`, response);
          this.authService.onSuccessLogin(response as any);
          return true;
          
        } catch (endpointError) {
          console.log(`❌ ${endpoint} no disponible:`, (endpointError as any)?.status);
          continue;
        }
      }
      
      // Si llegamos aquí, ningún endpoint funcionó
      console.error('❌ Ningún endpoint de authorization code disponible');
      return false;
      
    } catch (error) {
      console.error('❌ Error en endpoints personalizados:', error);
      return false;
    }
  }

  /**
   * Redirige después de autenticación exitosa
   */
  private async redirectAfterAuth(): Promise<void> {
    try {
      const dest = await this.authService.validarTerminosYPerfil();
      
      if (dest && dest !== '/') {
        this.router.navigate([dest]);
      } else {
        this.navigationService.navegarAPrimeraPaginaDisponible();
      }
    } catch (error) {
      console.error('Error validando términos y perfil:', error);
      this.navigationService.navegarAPrimeraPaginaDisponible();
    }
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(message: string): void {
    console.error('🚨 Manejando error de autenticación:', message);
    
    this.router.navigate(['/auth/login'], {
      queryParams: {
        sso_error: 'google_auth_failed',
        sso_error_description: message
      },
      replaceUrl: true
    });
  }
}
