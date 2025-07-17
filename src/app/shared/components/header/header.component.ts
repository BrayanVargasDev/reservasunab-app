import {
  Component,
  inject,
  Input,
  signal,
  OnInit,
  HostListener,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
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
import { NavigationService } from '@shared/services/navigation.service';
import { UsuarioLogueado } from '@auth/interfaces/usuario-logueado.interface';
import { UpperFirstPipe } from '@shared/pipes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CommonModule,
    WebIconComponent,
    UpperFirstPipe,
  ],
})
export class HeaderComponent implements OnInit {
  title = signal('Reservas UNAB');

  appService = inject(AppService);

  private authServicio = inject(AuthService);
  private plataforma = inject(Platform);
  private navigationService = inject(NavigationService);
  private router = inject(Router);

  usuario = computed(() => this.authServicio.usuario());
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
    this.authServicio.logout().then(
      () => {
        this.authServicio.setToken(null);
        this.authServicio.setUser(null);
        this.authServicio.setLoading(false);
        this.router.navigate(['/auth/login']);
      },
      error => {
        console.error('Error al cerrar sesión:', error);
        this.authServicio.setLoading(false);
      },
    );
  }

  toggleMenu() {
    const event = new CustomEvent('toggle-menu', { bubbles: true });
    document.dispatchEvent(event);
  }

  toggleMobileDrawer() {
    const event = new CustomEvent('toggle-mobile-drawer', { bubbles: true });
    document.dispatchEvent(event);
  }

  obtenerLeyenda(usuario: UsuarioLogueado | null): string {
    return usuario?.rol?.nombre ?? usuario?.tipo_usuario ?? 'Usuario';
  }

  navegarAlInicio() {
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }
}
