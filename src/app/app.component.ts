import {
  Component,
  inject,
  OnInit,
  signal,
  effect,
  computed,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { setDefaultOptions } from 'date-fns';
import { es } from 'date-fns/locale';

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
export class AppComponent implements OnInit {
  private router = inject(Router);

  appService = inject(AppService);
  authService = inject(AuthService);
  sessionSyncService = inject(SessionSyncService);
  globalLoaderService = inject(GlobalLoaderService);

  showMenu = signal(false);

  isInitializing = computed(() => {
    return this.authService.estadoAutenticacion() === 'chequeando';
  });

  constructor() {
    setDefaultOptions({ locale: es });
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const rutasSinMenu = [
        '/auth',
        '/pagos/reservas',
        '/acceso-denegado',
        '/404',
      ];
      this.showMenu.set(!rutasSinMenu.some(ruta => url.includes(ruta)));
    });
  }
}
