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
import { PermissionService } from '@shared/services/permission.service';
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
  private permissionService = inject(PermissionService);

  public appService = inject(AppService);

  menuItems = computed<Pantalla[]>(() => {
    return this.permissionService.obtenerPantallasAccesibles();
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

  closeMenu() {
    this.isMenuOpen.set(false);
    document.body.classList.remove('menu-open');
  }

  toggleMenu() {
    const newState = !this.isMenuOpen();
    this.isMenuOpen.set(newState);

    if (newState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }

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
