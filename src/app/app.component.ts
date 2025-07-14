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

import moment from 'moment-timezone';

import { AppService } from './app.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterOutlet],
})
export class AppComponent implements OnInit {
  momentL = moment;
  private router = inject(Router);

  appService = inject(AppService);
  authService = inject(AuthService);

  showMenu = signal(false);

  constructor() {
    this.momentL.tz.setDefault('America/Bogota');
    this.momentL.locale('es');

    // Removemos el effect() problemático - dejar que AuthGuard maneje la autenticación
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      const rutasSinMenu = ['/auth', '/pagos/reservas', '/acceso-denegado'];
      this.showMenu.set(!rutasSinMenu.some(ruta => url.includes(ruta)));
    });
  }
}
