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
import { IonicModule } from '@ionic/angular';
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
  host: {
    class: 'ion-safe-area',
  },
})
export class MainLayoutComponent {
  appService = inject(AppService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);

  private currentUrl = signal<string>(this.router.url);

  constructor() {
    effect(
      () => {
        this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.currentUrl.set(event.url);
          });
      },
      { injector: this.injector },
    );
  }

  shouldShowMenu = computed(() => {
    const url = this.currentUrl();

    if (url.includes('completeProfile=true')) {
      return false;
    }

    const routesWithoutMenu = ['/auth/', '/terms-conditions'];
    const shouldHide = routesWithoutMenu.some(route => url.includes(route));

    if (shouldHide) {
      return false;
    }

    return true;
  });
}
