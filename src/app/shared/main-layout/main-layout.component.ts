import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { HeaderComponent } from '../components/header/header.component';
import { MobileDrawerComponent } from '../components/mobile-drawer/mobile-drawer.component';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    IonicModule,
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
}
