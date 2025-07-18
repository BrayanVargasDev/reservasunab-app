import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { MisReservasService } from '@reservas/services/mis-reservas.service';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { environment } from '@environments/environment';
import { UpperFirstPipe } from '@shared/pipes';
import { Reserva } from '@reservas/interfaces';

@Component({
  selector: 'app-mis-reservas.page',
  imports: [
    CommonModule,
    WebIconComponent,
    BreadcrumbsComponent,
    UpperFirstPipe,
  ],
  templateUrl: './mis-reservas.page.html',
  styleUrl: './mis-reservas.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MisReservasPage {
  private misReservasService = inject(MisReservasService);
  private environment = environment;

  get misReservas() {
    return this.misReservasService.misReservasQuery.data();
  }

  public getImagenUrl(ubicacion: string | undefined): string {
    if (!ubicacion) return '';
    return `${environment.apiUrl}${ubicacion}`;
  }

  public sePuedeCancelar(reserva: Reserva): boolean {
    return reserva.puede_cancelar && reserva.estado === 'pendiente';
  }
}
