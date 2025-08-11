import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ViewContainerRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { TablaPagosComponent } from '@pagos/components/tabla-pagos/tabla-pagos.component';
import { PagosService } from '@pagos/services/pagos.service';
import { AlertasService } from '@shared/services/alertas.service';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-pagos-main',
  templateUrl: './pagos-main.page.html',
  styleUrls: ['./pagos-main.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebIconComponent,
    TablaPagosComponent,
  ],
  host: {
    class: 'flex flex-col w-full h-full sm:pl-3 relative overflow-y-auto',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagosMainPage implements OnInit, OnDestroy {
  private alertaService = inject(AlertasService);
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public pagosService = inject(PagosService);

  public alertaPago = viewChild.required('alertaPagos', {
    read: ViewContainerRef,
  });

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(texto => {
        this.pagosService.setFiltroTexto(texto.trim());
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  aplicarFiltro(texto: string) {
    this.searchSubject.next(texto);
  }

  limpiarFiltro() {
    this.pagosService.limpiarFiltro();
  }

  formatearMonto(monto: number): string {
    return this.pagosService.formatearMonto(monto);
  }

  obtenerEstadisticas() {
    const pagos = this.pagosService.pagosQuery.data() || [];

    const completados = pagos.filter(
      p => this.pagosService.obtenerColorEstado(p.estado) === 'success',
    );
    const pendientes = pagos.filter(
      p => this.pagosService.obtenerColorEstado(p.estado) === 'warning',
    );
    const rechazados = pagos.filter(
      p => this.pagosService.obtenerColorEstado(p.estado) === 'error',
    );

    return {
      completados: {
        cantidad: completados.length,
        total: completados.reduce((sum, p) => sum + parseFloat(p.valor), 0),
      },
      pendientes: {
        cantidad: pendientes.length,
        total: pendientes.reduce((sum, p) => sum + parseFloat(p.valor), 0),
      },
      rechazados: {
        cantidad: rechazados.length,
        total: rechazados.reduce((sum, p) => sum + parseFloat(p.valor), 0),
      },
      total: {
        cantidad: pagos.length,
        total: pagos.reduce((sum, p) => sum + parseFloat(p.valor), 0),
      },
    };
  }
}
