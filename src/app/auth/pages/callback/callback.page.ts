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
  private mobileAuthService = inject(MobileAuthService);
  private platform = inject(Platform);

  async ngOnInit() {
    try {
      console.log('Callback page inicializado');
      
      // Obtener parámetros de la query string
      this.route.queryParams.subscribe(async params => {
        const code = params['code'];
        const error = params['error'];
        const errorDescription = params['error_description'];
        const state = params['state'];

        console.log('Parámetros de callback:', { code: code ? 'presente' : 'ausente', error, errorDescription, state });

        // Verificar si hay errores
        if (error) {
          console.error('Error OAuth:', error, errorDescription);
          await this.handleOAuthError(error, errorDescription || 'Error en autenticación');
          return;
        }

        // Verificar si tenemos código
        if (!code) {
          console.error('No se recibió código de autorización');
          await this.handleOAuthError('no_code', 'No se recibió código de autorización');
          return;
        }

        // Procesar el código de autorización
        try {
          console.log('Intercambiando código por token...');
          const success = await this.authService.intercambiarToken(code);

          if (!success) {
            console.error('Fallo en intercambio de token');
            await this.handleOAuthError('token_exchange_failed', 'Error al intercambiar tokens');
            return;
          }

          console.log('Autenticación exitosa, redirigiendo...');
          
          // Validar términos y perfil, y redirigir
          const dest = await this.authService.validarTerminosYPerfil();
          
          if (dest && dest !== '/') {
            this.router.navigate([dest]);
          } else {
            this.navigationService.navegarAPrimeraPaginaDisponible();
          }

        } catch (error) {
          console.error('Error procesando callback:', error);
          await this.handleOAuthError('processing_error', 'Error procesando autenticación');
        }
      });

    } catch (error) {
      console.error('Error en ngOnInit de callback:', error);
      await this.handleOAuthError('init_error', 'Error iniciando callback');
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
