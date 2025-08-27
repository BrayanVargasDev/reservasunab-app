import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { TablaReservasComponent } from '@reservas/components/tabla-reservas/tabla-reservas.component';
import { ReservasAdminService } from '@reservas/services/reservas-admin.service';
import { AppService } from '@app/app.service';
import { AlertasService } from '@shared/services/alertas.service';
import { AuthService } from '@auth/services/auth.service';
import { BreadcrumbsComponent } from "@app/shared/components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-reservas-main',
  templateUrl: './reservas-main.page.html',
  styleUrls: ['./reservas-main.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaReservasComponent, BreadcrumbsComponent],
  host: {
    class: 'flex flex-col h-full w-full sm:pl-3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReservasMainPage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  public authService = inject(AuthService);
  public appService = inject(AppService);
  public reservasService = inject(ReservasAdminService);
  private alertaService = inject(AlertasService);

  public alertaReservas = viewChild.required('alertaReservas', {
    read: ViewContainerRef,
  });

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(texto => this.reservasService.setFiltroTexto(texto));
  }

  aplicarFiltro(texto: string) {
    this.searchSubject.next(texto);
  }
  limpiarFiltro() {
    this.reservasService.limpiarFiltro();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
