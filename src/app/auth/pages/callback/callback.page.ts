import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';

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

  async ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const code = qp.get('code') ?? '';
    const returnUrl = qp.get('returnUrl') ?? '';

    try {
      // Intercambiar code por tokens (access en memoria, refresh persistente)
      const response = await this.authService.intercambiarToken(code);

      if (!response) {
        await this.router.navigate(['/auth/login']);
        return;
      }
      // Decidir ruta de destino respetando lógica de términos/perfil
      const dest = await this.authService.postLoginRedirect();

      if (dest !== '/' && dest) {
        await this.router.navigate([dest]);
        return;
      }

      if (returnUrl && returnUrl !== '/') {
        await this.router.navigate([returnUrl]);
        return;
      }

      await this.navigationService.navegarAPrimeraPaginaDisponible();
    } catch (e) {
      console.error('Error en callback OAuth:', e);
      await this.router.navigate(['/auth/login']);
    }
  }
}
