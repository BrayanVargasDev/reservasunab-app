import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import moment from 'moment';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { MisReservasService } from '@reservas/services/mis-reservas.service';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { environment } from '@environments/environment';
import { UpperFirstPipe } from '@shared/pipes';
import { Reserva } from '@reservas/interfaces';
import { ModalDreservasComponent } from '@reservas/components/modal-dreservas/modal-dreservas.component';
import { DreservasService } from '@reservas/services/dreservas.service';

@Component({
  selector: 'app-mis-reservas.page',
  imports: [
    CommonModule,
    WebIconComponent,
    BreadcrumbsComponent,
    UpperFirstPipe,
    ModalDreservasComponent,
  ],
  templateUrl: './mis-reservas.page.html',
  styleUrl: './mis-reservas.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MisReservasPage implements OnInit, OnDestroy {
  public misReservasService = inject(MisReservasService);
  private router = inject(Router);
  private environment = environment;
  private dreservasService = inject(DreservasService);

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((texto: string) => {
        this.misReservasService.setFiltroTexto(texto);
      });
  }

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

  public navegarReservas() {
    this.router.navigate(['reservas']);
  }

  public formatearFechaReserva(fecha: string | Date): string {
    return moment(fecha).format('DD/MM/YYYY');
  }

  aplicarFiltro(texto: string) {
    this.searchSubject.next(texto);
  }

  public verDetalleReserva(idReserva: number) {
    this.dreservasService.abrirModal(true);

    this.dreservasService.setCargando('Cargando reserva...');
    this.dreservasService.setIdMiReserva(idReserva);

    setTimeout(() => {
      this.dreservasService.miReservaQuery
        .refetch()
        .then(() => {
          const reserva = this.dreservasService.miReservaQuery.data();
          if (reserva) {
            this.dreservasService.setMostrarResumenExistente(reserva);
          } else {
            this.dreservasService.cerrarModal();
            console.error(
              'No se pudo cargar la reserva. Por favor, inténtalo de nuevo.',
            );
          }
        })
        .catch(error => {
          console.error('Error al obtener mi reserva:', error);
          this.dreservasService.cerrarModal();
        });
    }, 1000);
  }

  public cancelarReserva(reserva: Reserva) {
    this.verDetalleReserva(reserva.id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
