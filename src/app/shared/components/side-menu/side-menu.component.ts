import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MenuItem, MenuService } from '../../services/menu.service';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
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

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink, RouterLinkActive],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private menuServicio = inject(MenuService);
  private authServicio = inject(AuthService);

  menuItems$: Observable<MenuItem[]> = of([]);
  isMenuOpen = signal(false);
  usuarioActual = this.authServicio.usuario();

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

  ngOnInit() {
    this.loadMenuItems();

    // Escuchar el evento personalizado para controlar el menú desde el header
    this.toggleMenuSubscription = () => {
      this.toggleMenu();
    };
    document.addEventListener('toggle-menu', this.toggleMenuSubscription);
  }

  ngOnDestroy() {
    // Limpiar los event listeners al destruir el componente
    if (this.toggleMenuSubscription) {
      document.removeEventListener('toggle-menu', this.toggleMenuSubscription);
    }
  }

  /**
   * Carga los elementos del menú desde el servicio
   */
  loadMenuItems() {
    this.menuItems$ = this.menuServicio.getMockMenuItems();
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
   * Verifica si el usuario tiene los permisos requeridos
   */
  tienePermisos(permissions?: string[]): boolean {
    // if (!permissions || permissions.length === 0) {
    //   return true;
    // }

    // // Utiliza el servicio de autenticación para verificar permisos
    // if (permissions.includes('admin') && this.currentUser?.rol === 'admin') {
    //   return true;
    // }

    // // Verifica si tiene al menos uno de los permisos requeridos
    // return permissions.some((permission) =>
    //   this.currentUser?.permisos?.includes(permission),
    // );
    return true;
  }

  /**
   * Cierra sesión y cierra el menú si está abierto
   */
  logout() {
    this.closeMenu();
    this.authServicio.logout();
  }
}
