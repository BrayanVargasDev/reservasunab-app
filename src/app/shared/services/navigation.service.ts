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
    setTimeout(() => {
      const pantallasDisponibles = this.obtenerPantallasDisponibles();

      if (pantallasDisponibles.length > 0) {
        const primeraPantalla = pantallasDisponibles[0];
        this.router.navigate([primeraPantalla.ruta]);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 500);
  }

  obtenerPrimeraRutaDisponible(): string {
    const pantallasDisponibles = this.obtenerPantallasDisponibles();

    if (pantallasDisponibles.length > 0) {
      return pantallasDisponibles[0].ruta;
    }

    return '/dashboard';
  }
}
