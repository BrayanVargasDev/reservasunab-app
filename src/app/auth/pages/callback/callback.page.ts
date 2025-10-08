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
export class AuthCallbackPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);
  private movbileAuthService = inject(MobileAuthService);
  private platform = inject(Platform);

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
