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
    try {
      const pantallas = this.permissionService.obtenerPantallasAccesibles();
      return pantallas || [];
    } catch (error) {
      return [];
    }
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

        const result = await this.router.navigate([primeraPantalla.ruta]);

        if (!result) {
          for (let i = 1; i < pantallasDisponibles.length; i++) {
            const rutaAlternativa = pantallasDisponibles[i];

            const resultadoAlternativo = await this.router.navigate([
              rutaAlternativa.ruta,
            ]);

            if (resultadoAlternativo) {
              return;
            }
          }

          const fallbackResult = await this.router.navigate(['/reservas']);

          if (!fallbackResult) {
            await this.router.navigateByUrl('/reservas');
          }
        }
      } else {
        await this.router.navigate(['/reservas']);
      }
    } catch (error) {
      try {
        await this.router.navigate(['/reservas']);
      } catch (fallbackError) {
        throw fallbackError;
      }
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
