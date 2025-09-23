import { Injectable, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '@shared/services/permission.service';
import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private permissionService = inject(PermissionService);
  private appService = inject(AppService);
  private authService = inject(AuthService);

  private obtenerPantallasDisponibles = computed(() => {
    try {
      const pantallas = this.permissionService.obtenerPantallasAccesibles();
      return pantallas || [];
    } catch (error) {
      return [];
    }
  });

  async navegarAPrimeraPaginaDisponible(): Promise<void> {
    try {
      const usuario = this.authService.usuario();
      const pantallasData = this.appService.pantallasQuery.data();

      if (!usuario) {
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      }

      if (!pantallasData || pantallasData.length === 0) {
        this.router.navigate(['/reservas'], { replaceUrl: true });
      }

      const pantallasDisponibles = this.obtenerPantallasDisponibles();

      if (pantallasDisponibles.length > 0) {
        const primeraPantalla = pantallasDisponibles[0];

        this.router.navigate([primeraPantalla.ruta]);
      } else {
        this.router.navigate(['/reservas'], { replaceUrl: true });
      }
    } catch (error) {
      this.router.navigate(['/reservas'], { replaceUrl: true });
    }
  }

  obtenerPrimeraRutaDisponible(): string {
    const pantallasDisponibles = this.obtenerPantallasDisponibles();

    if (pantallasDisponibles.length > 0) {
      return pantallasDisponibles[0].ruta;
    }

    return '/reservas';
  }
}
