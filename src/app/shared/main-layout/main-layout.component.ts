import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  effect,
  Injector,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import {
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { HeaderComponent } from '../components/header/header.component';
import { MobileDrawerComponent } from '../components/mobile-drawer/mobile-drawer.component';
import { AppService } from '@app/app.service';
import { AuthService } from '../../auth/services/auth.service';
import { UserStateEventsService } from '../services/user-state-events.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    SideMenuComponent,
    HeaderComponent,
    MobileDrawerComponent,
    RouterOutlet,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MainLayoutComponent {
  appService = inject(AppService);
  private authService = inject(AuthService);
  private userStateEvents = inject(UserStateEventsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);

  private currentUrl = signal<string>(this.router.url);
  private termsAccepted = signal<boolean>(false);
  private profileCompleted = signal<boolean>(false);
  private userStateLoaded = signal<boolean>(false);

  constructor() {
    // Efecto para detectar cambios de URL
    effect(
      () => {
        this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.currentUrl.set(event.url);
          });
      },
      { injector: this.injector },
    );

    // Suscribirse a eventos de cambio de estado del usuario
    this.userStateEvents.profileCompleted$.subscribe(() => {
      this.refreshUserState();
    });

    this.userStateEvents.termsAccepted$.subscribe(() => {
      this.refreshUserState();
    });

    // Cargar estado del usuario al inicializar
    this.loadUserState();
  }

  private async loadUserState() {
    try {
      // Verificar términos aceptados
      const termsAccepted = await this.authService.checkTerminosAceptados();
      this.termsAccepted.set(termsAccepted);

      // Verificar perfil completado
      const profileCompleted = await this.authService.checkPerfilCompletado();
      this.profileCompleted.set(profileCompleted);

      this.userStateLoaded.set(true);
    } catch (error) {
      console.error('[MainLayout] Error al cargar estado del usuario:', error);
      this.userStateLoaded.set(true); // Marcar como cargado para evitar bloqueo
    }
  }

  // Método público para refrescar el estado del usuario
  public async refreshUserState() {
    this.userStateLoaded.set(false);
    await this.loadUserState();
  }

  shouldShowMenu = computed(() => {
    const url = this.currentUrl();
    const userStateLoaded = this.userStateLoaded();
    const termsAccepted = this.termsAccepted();
    const profileCompleted = this.profileCompleted();

    // Si aún no se ha cargado el estado del usuario, no mostrar menu
    if (!userStateLoaded) {
      return false;
    }

    // Rutas donde no se muestra nada (ni header ni sidebar)
    if (url.includes('/auth/')) {
      return false;
    }

    // Mostrar header siempre que no sea ruta de auth (incluso en términos y perfil incompleto)
    // para permitir logout
    return true;
  });

  shouldShowSidebar = computed(() => {
    const url = this.currentUrl();
    const userStateLoaded = this.userStateLoaded();
    const termsAccepted = this.termsAccepted();
    const profileCompleted = this.profileCompleted();

    // Si aún no se ha cargado el estado del usuario, no mostrar sidebar
    if (!userStateLoaded) {
      return false;
    }

    // No mostrar sidebar en rutas de autenticación
    if (url.includes('/auth/')) {
      return false;
    }

    // No mostrar sidebar en términos y condiciones
    if (url.includes('/terms-conditions')) {
      return false;
    }

    // Mostrar sidebar solo si el usuario ha aceptado términos Y completado perfil
    const shouldShow = termsAccepted && profileCompleted;
    return shouldShow;
  });
}
