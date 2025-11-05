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
      console.log('[NavigationService] Iniciando navegación a primera página disponible...');
      
      const usuario = this.authService.usuario();
      const pantallasData = this.appService.pantallasQuery.data();

      console.log('[NavigationService] Usuario:', usuario?.tipo_usuario);
      console.log('[NavigationService] Pantallas data:', pantallasData?.length);

      if (!usuario) {
        console.log('[NavigationService] No hay usuario, navegando a login');
        await this.router.navigate(['/auth/login'], { replaceUrl: true });
        return;
      }

      if (!pantallasData || pantallasData.length === 0) {
        console.log('[NavigationService] No hay pantallas data, navegando a reservas como fallback');
        await this.router.navigate(['/reservas'], { replaceUrl: true });
        return;
      }

      const pantallasDisponibles = this.obtenerPantallasDisponibles();
      console.log('[NavigationService] Pantallas disponibles:', pantallasDisponibles);

      if (pantallasDisponibles.length > 0) {
        const primeraPantalla = pantallasDisponibles[0];
        console.log('[NavigationService] Navegando a primera pantalla:', primeraPantalla.ruta);
        await this.router.navigate([primeraPantalla.ruta], { replaceUrl: true });
        return;
      } else {
        console.log('[NavigationService] No hay pantallas disponibles, navegando a reservas');
        await this.router.navigate(['/reservas'], { replaceUrl: true });
        return;
      }
    } catch (error) {
      console.error('[NavigationService] Error durante navegación:', error);
      await this.router.navigate(['/reservas'], { replaceUrl: true });
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
