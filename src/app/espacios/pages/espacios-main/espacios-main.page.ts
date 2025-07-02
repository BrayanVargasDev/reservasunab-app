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
import { TablaEspaciosComponent } from '@espacios/components/tabla-espacios/tabla-espacios.component';
import { EspaciosService } from '@espacios/services/espacios.service';
import { Espacio } from '@espacios/interfaces';
import { ModalEspaciosComponent } from '@espacios/components/modal-espacios/modal-espacios.component';
import { AlertasService } from '@shared/services/alertas.service';

@Component({
  selector: 'app-espacios-main',
  templateUrl: './espacios-main.page.html',
  styleUrls: ['./espacios-main.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebIconComponent,
    TablaEspaciosComponent,
    ModalEspaciosComponent,
  ],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspaciosMainPage implements OnInit, OnDestroy {
  private alertaService = inject(AlertasService);
  public appService = inject(AppService);
  public espaciosService = inject(EspaciosService);

  public alertaEspacio = viewChild.required('alertaEspacios', {
    read: ViewContainerRef,
  });

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((texto: string) => {
        this.espaciosService.setFiltroTexto(texto);
      });
  }

  public crearEspacio() {
    this.espaciosService.abrirModal();
  }

  public editarEspacio(espacio: Espacio) {
    this.espaciosService.setEspacioAEditar(espacio);
    this.espaciosService.setModoEdicion(true);
    this.espaciosService.abrirModal();
  }

  public espacioGuardadoExitoso(event: boolean) {
    const estilosAlerta =
      'fixed flex p-4 transition-all ease-in-out bottom-4 right-4';
    if (event) {
      this.alertaService.success(
        'Espacio guardado exitosamente.',
        50000,
        this.alertaEspacio(),
        estilosAlerta,
      );
    } else {
      this.alertaService.error(
        'Error al guardar el espacio. Por favor, inténtalo de nuevo.',
        50000,
        this.alertaEspacio(),
        estilosAlerta,
      );
    }
  }

  aplicarFiltro(texto: string) {
    this.searchSubject.next(texto);
  }

  limpiarFiltro() {
    this.espaciosService.limpiarFiltro();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
