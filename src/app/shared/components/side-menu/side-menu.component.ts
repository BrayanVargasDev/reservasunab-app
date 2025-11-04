import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { PermissionService } from '@shared/services/permission.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Pantalla } from '../../interfaces/pantalla.interface';
import { STORAGE_KEYS } from '@app/auth/constants/storage.constants';
import { StorageService } from '@shared/services/storage.service';

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
  private permissionService = inject(PermissionService);
  private storageService = inject(StorageService);

  public appService = inject(AppService);

  menuItems = computed<Pantalla[]>(() => {
    return this.permissionService.obtenerPantallasAccesibles();
  });
  isMenuOpen = signal(false);
  usuarioActual = computed(() => this.authServicio.usuario());

  perfilCompletado = signal(
    this.storageService.getItem(STORAGE_KEYS.PROFILE_COMPLETED) === 'true',
  );

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

    this.storageService.changes.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event?.key === STORAGE_KEYS.PROFILE_COMPLETED) {
        this.perfilCompletado.set(event.newValue === 'true');
      }
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
    this.authServicio.logout();
  }
}
