import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  effect,
  computed,
  NgZone,
} from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { InAppBrowser as Browser } from '@capacitor/inappbrowser';

import { AppService } from './app.service';
import { AuthService } from '@auth/services/auth.service';
import { SessionSyncService } from '@auth/services/session-sync.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { AuthLoadingComponent } from '@shared/components/auth-loading/auth-loading.component';
import { GlobalLoaderComponent } from '@shared/components/global-loader/global-loader.component';
import { IndexedDbService } from '@shared/services/indexed-db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterOutlet,
    AuthLoadingComponent,
    GlobalLoaderComponent,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;

  appService = inject(AppService);
  authService = inject(AuthService);
  globalLoaderService = inject(GlobalLoaderService);
  ngZone = inject(NgZone);

  showMenu = signal(false);

  isInitializing = computed(() => {
    return this.authService.estadoAutenticacion() === 'loading';
  });

  constructor() {
    setDefaultOptions({ locale: es });
  }

  async ngOnInit() {
    this.initializeApp();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const rutasSinMenu = [
          '/auth',
          '/pagos/reservas',
          '/acceso-denegado',
          '/404',
        ];
        this.showMenu.set(!rutasSinMenu.some(ruta => url.includes(ruta)));

        this.globalLoaderService.hide();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.ngZone.run(() => {
        try {
          const url = new URL(event.url);
          const path = url.pathname + url.search; // e.g., '/auth/callback?code=...'
          if (path) {
            this.router.navigateByUrl(path);
          }
        } catch (error) {
          console.error('Error parsing deep link URL:', error);
        }
      });
    });
  }

  /**
   * Maneja deep links abiertos en la app
   */
  private async handleDeepLink(url: string) {
    console.debug('Deep link recibido:', url);

    try {
      const urlObj = new URL(url);
      if (
        urlObj.pathname === '/auth/callback' ||
        urlObj.pathname.endsWith('/auth/callback')
      ) {
        const code = urlObj.searchParams.get('code');
        const error = urlObj.searchParams.get('error');
        const errorDescription = urlObj.searchParams.get('error_description');
        const returnUrl = urlObj.searchParams.get('returnUrl');

        // Procesar como si fuera el callback normal
        if (error) {
          console.error(
            'OAuth error desde deep link:',
            error,
            errorDescription,
          );
          return this.router.navigate(['/auth/login'], {
            queryParams: {
              sso_error: error,
              sso_error_description:
                errorDescription || 'Error en autenticación SSO móvil',
            },
          });
        }

        if (!code) {
          console.error('No code en deep link');
          return this.router.navigate(['/auth/login'], {
            queryParams: {
              sso_error: 'no_code',
              sso_error_description: 'No se recibió código de autorización',
            },
          });
        }

        // Intercambiar token
        const success = await this.authService.intercambiarToken(code);
        if (!success) {
          this.authService.setLoading(false);
          return this.router.navigate(['/auth/login'], {
            replaceUrl: true,
            queryParams: {
              sso_error: 'token_exchange_failed',
              sso_error_description: 'Error al intercambiar tokens',
            },
          });
        }

        // Redirigir como normal
        const dest = await this.authService.validarTerminosYPerfil();
        if (dest && dest !== '/') {
          return this.router.navigate([dest]);
        } else if (returnUrl && returnUrl !== '/') {
          return this.router.navigate([returnUrl], { replaceUrl: true });
        } else {
          return this.router.navigateByUrl('/', { replaceUrl: true });
        }
      }
    } catch (error) {
      console.error('Error procesando deep link:', error);
    }
    return;
  }
}
