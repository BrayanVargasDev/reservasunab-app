import {
  Component,
  inject,
  Input,
  signal,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  chevronDownOutline,
  logOutOutline,
  menuOutline,
  notificationsOutline,
  personOutline,
} from 'ionicons/icons';

import { AuthService } from '@auth/services/auth.service';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '../web-icon/web-icon.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, CommonModule, WebIconComponent],
})
export class HeaderComponent implements OnInit {
  title = signal('App UNAB');

  appService = inject(AppService);

  private authServicio = inject(AuthService);
  private plataforma = inject(Platform);

  usuario = this.authServicio.usuario();
  isMobile = signal(false);
  screenWidth = signal(window.innerWidth);

  constructor() {
    addIcons({
      notificationsOutline,
      menuOutline,
      logOutOutline,
      personOutline,
      chevronDownOutline,
    });

    this.chequearPlataforma();
  }

  ngOnInit() {
    this.actualizarIsMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.actualizarIsMobile();
  }

  chequearPlataforma() {
    if (
      this.plataforma.is('mobile') ||
      this.plataforma.is('mobileweb') ||
      window.innerWidth <= 768
    ) {
      this.isMobile.set(true);
    }
  }

  actualizarIsMobile() {
    const esMobile =
      this.plataforma.is('mobile') ||
      this.plataforma.is('mobileweb') ||
      window.innerWidth <= 768;
    this.isMobile.set(esMobile);
  }

  get nombreUsuario(): string {
    return this.authServicio.usuario()?.nombre || 'Usuario';
  }

  get tipoUsuario(): string {
    return this.authServicio.usuario()?.rol.nombre || 'Usuario';
  }

  get fotoUsuario(): string {
    return (
      this.authServicio.usuario()?.nombre ||
      'https://ionicframework.com/docs/img/demos/avatar.svg'
    );
  }

  cerrarSesion() {
    this.authServicio.logout();
  }

  toggleMenu() {
    const event = new CustomEvent('toggle-menu', { bubbles: true });
    document.dispatchEvent(event);
  }
}
