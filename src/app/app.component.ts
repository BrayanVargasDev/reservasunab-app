import { Component, inject, OnInit, signal, effect } from '@angular/core';
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

    effect(() => {
      const isAuthenticated = this.authService.estaAutenticado();
      if (!isAuthenticated) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showMenu.set(!this.router.url.includes('/auth'));
    });
  }
}
