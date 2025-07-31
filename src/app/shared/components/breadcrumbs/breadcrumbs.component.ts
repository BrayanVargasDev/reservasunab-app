import { Component, computed, inject, input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [CommonModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  estilos = input('py-2');

  private navigationEnd$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
  );

  private navigationSignal = toSignal(this.navigationEnd$);

  breadcrumbs = computed(() => {
    this.navigationSignal();

    return this.createBreadcrumbs();
  });

  private createBreadcrumbs(): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    let route: ActivatedRoute | null = this.activatedRoute.root;
    let url = '';

    breadcrumbs.push({
      label: 'Inicio',
      url: '/',
      isActive: false,
    });

    while (route) {
      if (!route.routeConfig || !route.routeConfig.path) {
        route = route.firstChild;
        continue;
      }

      if (route.routeConfig.path === '**') {
        route = route.firstChild;
        continue;
      }

      const routeParams = route.snapshot.params;
      let routePath = route.routeConfig.path;

      Object.keys(routeParams).forEach(key => {
        routePath = routePath.replace(`:${key}`, routeParams[key]);
      });

      url += `/${routePath}`;

      const breadcrumbLabel =
        route.snapshot.data?.['breadcrumb'] ||
        route.snapshot.data?.['title'] ||
        this.formatPathName(routePath);

      if (breadcrumbLabel && breadcrumbLabel !== 'Inicio') {
        breadcrumbs.push({
          label: breadcrumbLabel,
          url: url,
          isActive: false,
        });
      }

      route = route.firstChild;
    }

    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isActive = true;
      breadcrumbs[breadcrumbs.length - 1].url = undefined; // El último no debe ser clickeable
    }

    return breadcrumbs;
  }

  private formatPathName(path: string): string {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  navigateTo(url: string | undefined) {
    if (url) {
      this.router.navigate([url]);
    }
  }
}
