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
import { QueryClient } from '@tanstack/angular-query-experimental';

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
  imports: [RouterLink, CommonModule, WebIconComponent, UpperFirstPipe],
})
export class HeaderComponent implements OnInit {
  title = signal(' Reservas');

  appService = inject(AppService);

  private authServicio = inject(AuthService);
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private queryClient = inject(QueryClient);

  usuario = computed(() => this.authServicio.usuario());
  isMobile = signal(false);
  screenWidth = signal(window.innerWidth);
  isRefreshing = signal(false);

  constructor() {}

  ngOnInit() {
    this.actualizarIsMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    this.actualizarIsMobile();
  }

  actualizarIsMobile() {
    const esMobile = window.innerWidth <= 768;
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
    return usuario?.rol?.nombre ?? usuario?.tipo_usuario[0] ?? 'Usuario';
  }

  navegarAlInicio() {
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }

  async recargarAplicacion() {
    if (this.isRefreshing()) return;

    this.isRefreshing.set(true);

    try {
      // Invalidar todas las queries del AppService
      await Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['tipoDocumento'] }),
        this.queryClient.invalidateQueries({ queryKey: ['pantallas'] }),
        this.queryClient.invalidateQueries({ queryKey: ['roles'] }),
        this.queryClient.invalidateQueries({ queryKey: ['sedes'] }),
        this.queryClient.invalidateQueries({ queryKey: ['categorias'] }),
        this.queryClient.invalidateQueries({ queryKey: ['grupos'] }),
        // Invalidar la query de usuario para verificar la sesión
        this.queryClient.invalidateQueries({ queryKey: ['user'] }),
      ]);

      // Refetch de todas las queries para asegurar que se ejecuten inmediatamente
      await Promise.all([
        this.queryClient.refetchQueries({ queryKey: ['tipoDocumento'] }),
        this.queryClient.refetchQueries({ queryKey: ['pantallas'] }),
        this.queryClient.refetchQueries({ queryKey: ['roles'] }),
        this.queryClient.refetchQueries({ queryKey: ['sedes'] }),
        this.queryClient.refetchQueries({ queryKey: ['categorias'] }),
        this.queryClient.refetchQueries({ queryKey: ['grupos'] }),
        this.queryClient.refetchQueries({ queryKey: ['user'] }),
      ]);
    } catch (error) {
      console.error('Error al recargar la aplicación:', error);
    } finally {
      this.isRefreshing.set(false);
    }
  }
}
