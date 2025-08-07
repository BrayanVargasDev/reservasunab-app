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
import { PermissionService } from '@shared/services/permission.service';
import { Pantalla } from '../../interfaces/pantalla.interface';
import { UpperFirstPipe } from '@shared/pipes';
import { UsuarioLogueado } from '@auth/interfaces/usuario-logueado.interface';

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
  private permissionService = inject(PermissionService);
  public appService = inject(AppService);

  menuItems = computed<Pantalla[]>(() => {
    return this.permissionService.obtenerPantallasAccesibles();
  });

  usuarioActual = computed(() => this.authServicio.usuario());

  private toggleListener?: () => void;

  constructor() {
    this.toggleListener = () => {
      this.toggleDrawer();
    };

    document.addEventListener('toggle-mobile-drawer', this.toggleListener);
  }

  ngOnDestroy() {
    if (this.toggleListener) {
      document.removeEventListener('toggle-mobile-drawer', this.toggleListener);
    }
  }

  toggleDrawer() {
    const checkbox = document.getElementById(
      'mobile-drawer-toggle',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;

      if (checkbox.checked) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }

  closeDrawer() {
    const checkbox = document.getElementById(
      'mobile-drawer-toggle',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
      document.body.classList.remove('overflow-hidden');
    }
  }

  navigateAndClose(route: string) {
    this.router.navigate([route]);
    this.closeDrawer();
  }

  logout() {
    this.closeDrawer();
    this.authServicio.logout().then(
      () => {
        this.authServicio.setToken(null);
        this.authServicio.setUser(null);
        this.authServicio.clearSession();
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

    return usuario.tipo_usuario[0] || 'Usuario';
  }

  onOverlayClick(event: Event) {
    event.stopPropagation();
    this.closeDrawer();
  }
}
