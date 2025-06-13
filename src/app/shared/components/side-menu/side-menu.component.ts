import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  public appService = inject(AppService);

  menuItems = computed<Pantalla[]>(
    () =>
      this.appService.pantallasQuery
        .data()
        ?.filter(pantalla => pantalla.visible)
        .sort((a, b) => a.orden - b.orden) ?? [],
  );
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
