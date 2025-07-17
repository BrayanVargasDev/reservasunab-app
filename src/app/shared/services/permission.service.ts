import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { AppService } from '@app/app.service';
import { Pantalla } from '@shared/interfaces/pantalla.interface';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);
  private appService = inject(AppService);

  puedeAccederARuta(ruta: string): boolean {
    const usuario = this.authService.usuario();

    if (!usuario) {
      return false;
    }

    if (usuario.rol?.nombre?.toLowerCase() === 'administrador') {
      return true;
    }

    // Permitir acceso a todas las rutas de reservas para todos los usuarios autenticados
    if (ruta.startsWith('/reservas')) {
      return true;
    }

    const pantallas = this.appService.pantallasQuery.data();
    if (!pantallas) {
      return false;
    }

    const pantallaCorrespondiente = this.buscarPantallaPorRuta(ruta, pantallas);

    if (!pantallaCorrespondiente) {
      return true;
    }

    const permisosUsuario = usuario.permisos || [];
    return permisosUsuario.some(
      permiso => permiso.id_pantalla === pantallaCorrespondiente.id_pantalla,
    );
  }

  tienePermiso(codigo: string): boolean {
    return this.authService.tienePermisos(codigo);
  }

  private buscarPantallaPorRuta(
    ruta: string,
    pantallas: Pantalla[],
  ): Pantalla | null {
    let pantalla = pantallas.find(p => p.ruta === ruta);

    if (!pantalla) {
      pantalla = pantallas.find(p => ruta.startsWith(p.ruta) && p.ruta !== '/');
    }

    return pantalla || null;
  }

  obtenerPantallasAccesibles(): Pantalla[] {
    const usuario = this.authService.usuario();

    if (!usuario) {
      return [];
    }

    const pantallas = this.appService.pantallasQuery.data();
    if (!pantallas) {
      return [];
    }

    let pantallasVisibles = pantallas.filter(pantalla => pantalla.visible);

    if (usuario.rol?.nombre?.toLowerCase() === 'administrador') {
      return pantallasVisibles.sort((a, b) => a.orden - b.orden);
    }

    const permisosUsuario = usuario.permisos || [];
    const pantallasPermitidas = new Set(
      permisosUsuario.map(permiso => permiso.id_pantalla),
    );

    // Incluir todas las pantallas de reservas para todos los usuarios autenticados
    const pantallasReservas = pantallasVisibles.filter(pantalla =>
      pantalla.ruta?.startsWith('/reservas'),
    );

    const pantallasConPermisos = pantallasVisibles.filter(pantalla =>
      pantallasPermitidas.has(pantalla.id_pantalla),
    );

    // Combinar pantallas con permisos y pantallas de reservas, evitando duplicados
    const todasLasPantallas = new Map();

    [...pantallasConPermisos, ...pantallasReservas].forEach(pantalla => {
      todasLasPantallas.set(pantalla.id_pantalla, pantalla);
    });

    return Array.from(todasLasPantallas.values()).sort(
      (a, b) => a.orden - b.orden,
    );
  }
}
