import { Injectable, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '@shared/services/permission.service';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private permissionService = inject(PermissionService);

  private obtenerPantallasDisponibles = computed(() => {
    return this.permissionService.obtenerPantallasAccesibles();
  });

  async navegarAPrimeraPaginaDisponible(): Promise<void> {
    try {
      const usuario = this.permissionService['authService'].usuario();
      const pantallasData =
        this.permissionService['appService'].pantallasQuery.data();

      if (!usuario) {
        await this.router.navigate(['/auth/login']);
        return;
      }

      if (!pantallasData || pantallasData.length === 0) {
        await this.router.navigate(['/reservas']);
        return;
      }

      const pantallasDisponibles = this.obtenerPantallasDisponibles();

      if (pantallasDisponibles.length > 0) {
        const primeraPantalla = pantallasDisponibles[0];
        await this.router.navigate([primeraPantalla.ruta]);
      } else {
        await this.router.navigate(['/reservas']);
      }
    } catch (error) {
      await this.router.navigate(['/reservas']);
    }
  }

  obtenerPrimeraRutaDisponible(): string {
    const pantallasDisponibles = this.obtenerPantallasDisponibles();

    if (pantallasDisponibles.length > 0) {
      return pantallasDisponibles[0].ruta;
    }

    return '/dashboard';
  }
}
