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
import { Reserva } from '@reservas/interfaces';
import { ModalDreservasComponent } from '@reservas/components/modal-dreservas/modal-dreservas.component';
import { DreservasService } from '@reservas/services/dreservas.service';
import { PagosService } from '@pagos/services/pagos.service';
import { UpperFirstPipe } from '@shared/pipes';

@Component({
  selector: 'app-mis-reservas.page',
  imports: [
    CommonModule,
    WebIconComponent,
    BreadcrumbsComponent,
    ModalDreservasComponent,
    UpperFirstPipe
  ],
  templateUrl: './mis-reservas.page.html',
  styleUrl: './mis-reservas.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full w-full sm:pl-3 overflow-y-auto',
  },
})
export default class MisReservasPage implements OnInit, OnDestroy {
  public misReservasService = inject(MisReservasService);
  private router = inject(Router);
  private environment = environment;
  private dreservasService = inject(DreservasService);

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  public pagosService = inject(PagosService);

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

  public async verDetalleReserva(idReserva: number) {
    this.dreservasService.abrirModal(true);
    this.dreservasService.setCargando('Cargando reserva...');

    // Establecer el ID de la reserva primero
    this.dreservasService.setIdMiReserva(idReserva);

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Hacer refetch de la query después de establecer el ID
      const result = await this.dreservasService.miReservaQuery.refetch();

      // Obtener los datos del resultado del refetch
      const reserva = result.data;

      if (reserva) {
        this.dreservasService.setMostrarResumenExistente(reserva);
      } else {
        this.dreservasService.cerrarModal();
        console.error(
          'No se pudo cargar la reserva. Por favor, inténtalo de nuevo.',
        );
      }
    } catch (error) {
      console.error('Error al obtener mi reserva:', error);
      this.dreservasService.cerrarModal();
    }
  }

  public cancelarReserva(reserva: Reserva) {
    this.verDetalleReserva(reserva.id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
