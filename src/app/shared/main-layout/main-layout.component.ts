import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Computed para determinar si se debe mostrar el menú
  shouldShowMenu = computed(() => {
    const url = this.router.url;

    // Ocultar menú si está en modo de completar perfil
    if (url.includes('completeProfile=true')) {
      return false;
    }

    // Otras condiciones donde ocultar el menú
    const routesWithoutMenu = ['/auth/', '/terms-conditions'];

    return !routesWithoutMenu.some(route => url.includes(route));
  });
}
