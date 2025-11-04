import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
  computed,
  NgZone,
} from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar, Style } from '@capacitor/status-bar';

import { AppService } from './app.service';
import { AuthService } from '@auth/services/auth.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { AuthLoadingComponent } from '@shared/components/auth-loading/auth-loading.component';
import { GlobalLoaderComponent } from '@shared/components/global-loader/global-loader.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
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
    await this.lockOrientation();
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light });
    this.initializeApp();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(async (event: NavigationEnd) => {
        const url = event.url;
        const rutasSinMenu = [
          '/auth',
          '/pagos/reservas',
          '/acceso-denegado',
          '/404',
        ];
        this.showMenu.set(!rutasSinMenu.some(ruta => url.includes(ruta)));

        this.setStatusBarColor(url);

        this.globalLoaderService.hide();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.debug('Se obtuvo un evento de open url', event.url);
      this.ngZone.run(() => {
        if (event.url.startsWith('com.unab.reservas://')) {
          const schemeRemoved = event.url.replace('com.unab.reservas://', '');
          const [path, query] = schemeRemoved.split('?');
          const fullPath = '/' + path + (query ? '?' + query : '');
          this.router.navigateByUrl(fullPath);
        } else {
          try {
            const url = new URL(event.url);
            const path = url.pathname + url.search;
            if (path) {
              this.router.navigateByUrl(path);
            }
          } catch (error) {
            console.error('Error parsing deep link URL:', error);
          }
        }
      });
    });
  }

  async lockOrientation() {
    try {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (err) {
      console.error('No se pudo bloquear la orientación', err);
    }
  }

  private async setStatusBarColor(url: string) {
    if (!Capacitor.isNativePlatform()) return;

    let color = '#ebebeb'; // Gris por defecto

    if (url.includes('/auth/login')) {
      color = '#ffa200'; // Naranja para auth
    } else if (url.includes('/pagos/pago-redirect')) {
      color = '#f8f9fa'; // Gris para pago-redirect (puede ser sobrescrito por effect)
    }

    await StatusBar.setBackgroundColor({ color });
  }
}
