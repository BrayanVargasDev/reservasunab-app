import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { HeaderComponent } from '../components/header/header.component';
import { inject } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [
    IonicModule,
    CommonModule,
    SideMenuComponent,
    HeaderComponent,
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
