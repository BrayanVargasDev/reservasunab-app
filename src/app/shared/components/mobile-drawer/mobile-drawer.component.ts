import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { WebIconComponent } from '../web-icon/web-icon.component';
import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { Pantalla } from '../../interfaces/pantalla.interface';
import { UpperFirstPipe } from '@shared/pipes';
import { UsuarioLogueado } from '../../../auth/interfaces/usuario-logueado.interface';

@Component({
  selector: 'app-mobile-drawer',
  templateUrl: './mobile-drawer.component.html',
  styleUrls: ['./mobile-drawer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    WebIconComponent,
    UpperFirstPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDrawerComponent implements OnDestroy {
  private authServicio = inject(AuthService);
  private router = inject(Router);
  public appService = inject(AppService);

  // Computed para obtener los elementos del menú con la misma lógica que el side-menu
  menuItems = computed<Pantalla[]>(() => {
    const pantallas = this.appService.pantallasQuery.data();
    const usuario = this.authServicio.usuario();

    if (!pantallas) return [];

    let pantallasVisibles = pantallas.filter(pantalla => pantalla.visible);

    if (!usuario) {
      return [];
    }

    if (usuario.rol?.nombre?.toLowerCase() === 'administrador') {
      return pantallasVisibles.sort((a, b) => a.orden - b.orden);
    }

    const permisosUsuario = usuario.permisos || [];
    const pantallaPermitidas = new Set(
      permisosUsuario.map(permiso => permiso.id_pantalla),
    );

    return pantallasVisibles
      .filter(pantalla => pantallaPermitidas.has(pantalla.id_pantalla))
      .sort((a, b) => a.orden - b.orden);
  });

  // Computed para obtener el usuario actual
  usuarioActual = computed(() => this.authServicio.usuario());

  private toggleListener?: () => void;

  constructor() {
    // Escuchar el evento de toggle del header
    this.toggleListener = () => {
      this.toggleDrawer();
    };

    document.addEventListener('toggle-mobile-drawer', this.toggleListener);
  }

  ngOnDestroy() {
    // Limpiar el listener al destruir el componente
    if (this.toggleListener) {
      document.removeEventListener('toggle-mobile-drawer', this.toggleListener);
    }
  }

  /**
   * Abre/cierra el drawer usando el checkbox de DaisyUI
   */
  toggleDrawer() {
    const checkbox = document.getElementById(
      'mobile-drawer-toggle',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;

      // Controlar el scroll del body
      if (checkbox.checked) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  /**
   * Cierra el drawer
   */
  closeDrawer() {
    const checkbox = document.getElementById(
      'mobile-drawer-toggle',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
      document.body.classList.remove('overflow-hidden');
    }
  }

  /**
   * Navega a una ruta y cierra el drawer
   */
  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.closeDrawer();
  }

  /**
   * Cierra sesión
   */
  logout() {
    this.closeDrawer();
    this.authServicio.logout().then(
      () => {
        this.authServicio.setToken(null);
        this.authServicio.setUser(null);
        this.authServicio.setLoading(false);
        this.router.navigate(['/auth/login']);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
      },
    );
  }

  obtenerLeyenda(usuario: UsuarioLogueado): string {
    if (usuario.rol) {
      return usuario.rol.nombre!;
    }

    return usuario.tipo_usuario || 'Usuario';
  }

  /**
   * Maneja el click del overlay
   */
  onOverlayClick(event: Event) {
    event.stopPropagation();
    this.closeDrawer();
  }
}
