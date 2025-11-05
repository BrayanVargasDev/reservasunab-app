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
            console.log('[MainLayout] URL cambió a:', event.url);
            this.currentUrl.set(event.url);
          });
      },
      { injector: this.injector },
    );

    // Suscribirse a eventos de cambio de estado del usuario
    this.userStateEvents.profileCompleted$.subscribe(() => {
      console.log('[MainLayout] Evento recibido: perfil completado');
      this.refreshUserState();
    });

    this.userStateEvents.termsAccepted$.subscribe(() => {
      console.log('[MainLayout] Evento recibido: términos aceptados');
      this.refreshUserState();
    });

    // Cargar estado del usuario al inicializar
    this.loadUserState();
  }

  private async loadUserState() {
    try {
      console.log('[MainLayout] Cargando estado del usuario...');
      
      // Verificar términos aceptados
      const termsAccepted = await this.authService.checkTerminosAceptados();
      this.termsAccepted.set(termsAccepted);
      console.log('[MainLayout] Términos aceptados:', termsAccepted);

      // Verificar perfil completado
      const profileCompleted = await this.authService.checkPerfilCompletado();
      this.profileCompleted.set(profileCompleted);
      console.log('[MainLayout] Perfil completado:', profileCompleted);

      this.userStateLoaded.set(true);
      console.log('[MainLayout] Estado del usuario cargado exitosamente');
    } catch (error) {
      console.error('[MainLayout] Error al cargar estado del usuario:', error);
      this.userStateLoaded.set(true); // Marcar como cargado para evitar bloqueo
    }
  }

  // Método público para refrescar el estado del usuario
  public async refreshUserState() {
    console.log('[MainLayout] Refrescando estado del usuario...');
    this.userStateLoaded.set(false);
    await this.loadUserState();
  }

  shouldShowMenu = computed(() => {
    const url = this.currentUrl();
    const userStateLoaded = this.userStateLoaded();
    const termsAccepted = this.termsAccepted();
    const profileCompleted = this.profileCompleted();

    console.log('[MainLayout] Evaluando shouldShowMenu para:', {
      url,
      userStateLoaded,
      termsAccepted,
      profileCompleted
    });

    // Si aún no se ha cargado el estado del usuario, no mostrar menu
    if (!userStateLoaded) {
      console.log('[MainLayout] Estado del usuario no cargado aún, ocultando menu');
      return false;
    }

    // Rutas donde no se muestra nada (ni header ni sidebar)
    if (url.includes('/auth/')) {
      console.log('[MainLayout] Ocultando menú: ruta de auth');
      return false;
    }

    // Mostrar header siempre que no sea ruta de auth (incluso en términos y perfil incompleto)
    // para permitir logout
    console.log('[MainLayout] shouldShowMenu resultado: true');
    return true;
  });

  shouldShowSidebar = computed(() => {
    const url = this.currentUrl();
    const userStateLoaded = this.userStateLoaded();
    const termsAccepted = this.termsAccepted();
    const profileCompleted = this.profileCompleted();

    console.log('[MainLayout] Evaluando shouldShowSidebar para:', {
      url,
      userStateLoaded,
      termsAccepted,
      profileCompleted
    });

    // Si aún no se ha cargado el estado del usuario, no mostrar sidebar
    if (!userStateLoaded) {
      console.log('[MainLayout] Estado del usuario no cargado aún, ocultando sidebar');
      return false;
    }

    // No mostrar sidebar en rutas de autenticación
    if (url.includes('/auth/')) {
      console.log('[MainLayout] Ocultando sidebar: ruta de autenticación');
      return false;
    }

    // No mostrar sidebar en términos y condiciones
    if (url.includes('/terms-conditions')) {
      console.log('[MainLayout] Ocultando sidebar: página de términos');
      return false;
    }

    // Mostrar sidebar solo si el usuario ha aceptado términos Y completado perfil
    const shouldShow = termsAccepted && profileCompleted;
    console.log('[MainLayout] shouldShowSidebar resultado:', shouldShow);
    return shouldShow;
  });
}
