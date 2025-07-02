import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  cardOutline,
  closeOutline,
  keyOutline,
  logOutOutline,
  menuOutline,
  peopleOutline,
  personOutline,
  speedometerOutline,
} from 'ionicons/icons';

import { WebIconComponent } from '../web-icon/web-icon.component';
import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Pantalla } from '../../interfaces/pantalla.interface';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink,
    RouterLinkActive,
    WebIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  private authServicio = inject(AuthService);
  private router = inject(Router);

  public appService = inject(AppService);

  menuItems = computed<Pantalla[]>(() => {
    const pantallas = this.appService.pantallasQuery.data();
    const usuario = this.authServicio.usuario();

    if (!pantallas) return [];

    let pantallasVisibles = pantallas.filter(pantalla => pantalla.visible);

    if (!usuario || !usuario.rol) {
      return [];
    }

    if (usuario.rol.nombre?.toLowerCase() === 'administrador') {
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
  isMenuOpen = signal(false);
  usuarioActual = computed(() => this.authServicio.usuario());

  private toggleMenuSubscription?: () => void;

  constructor() {
    addIcons({
      closeOutline,
      logOutOutline,
      menuOutline,
      speedometerOutline,
      keyOutline,
      cardOutline,
      peopleOutline,
      personOutline,
    });
  }

  /**
   * Cierra el menú
   */
  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.classList.remove('menu-open');
  }

  /**
   * Abre/cierra el menú desplegable
   */
  toggleMenu() {
    const newState = !this.isMenuOpen();
    this.isMenuOpen.set(newState);

    // Añadir/quitar clase al body para efectos visuales (overlay, etc)
    if (newState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

  /**
   * Cierra sesión y cierra el menú si está abierto
   */
  logout() {
    this.closeMenu();
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
}
