import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterOutlet],
})
export class AppComponent implements OnInit {
  appService = inject(AppService);

  showMenu = signal(false);

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showMenu.set(!this.router.url.includes('/auth'));
    });
  }
}
