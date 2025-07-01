import {
  Component,
  OnInit,
  signal,
  effect,
  viewChild,
  ElementRef,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import Pikaday from 'pikaday';
import moment from 'moment';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { EspacioParaConfig, Espacio } from '@espacios/interfaces';
import { inject, ChangeDetectionStrategy } from '@angular/core';
import { DreservasService } from '@reservas/services/dreservas.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-dreservas-main',
  templateUrl: './dreservas-main.page.html',
  styleUrls: ['./dreservas-main.page.scss'],
  standalone: true,
  imports: [CommonModule, WebIconComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DreservasMainPage implements OnInit {
  private injector = inject(Injector);
  private dreservasService = inject(DreservasService);
  private espacioConfigService = inject(EspaciosConfigService);

  public appService = inject(AppService);
  public fecha = new FormControl('');
  public sede = new FormControl('');
  public categoria = new FormControl('');
  public fechaSeleccionada = signal<string>('');
  public sedeSeleccionada = signal<number | null>(null);
  public categoriaSeleccionada = signal<number | null>(null);
  public pikaday!: Pikaday;
  public fechaPicker =
    viewChild.required<ElementRef<HTMLInputElement>>('fechaPicker');

  ngOnInit() {
    this.initializePikaday();
  }

  public get espacios() {
    return this.dreservasService.allEspaciosQuery.data() || [];
  }

  public get espacioFull() {
    return this.espacioConfigService.espacioQuery.data() || null;
  }

  private initializePikaday() {
    this.pikaday = new Pikaday({
      field: this.fechaPicker()?.nativeElement,
      i18n: i18nDatePicker,
      format: 'DD/MM/YYYY',
      onSelect: (date: Date) => {
        this.fechaSeleccionada.set(moment(date).format('YYYY-MM-DD'));
        this.fecha.setValue(moment(date).format('DD/MM/YYYY'));
      },
    });
  }

  public limpiarFecha() {
    this.fechaSeleccionada.set('');
    this.pikaday.setDate(null);
    this.fecha.setValue('');
  }

  public limpiarUbicacion() {
    this.sedeSeleccionada.set(null);
    this.sede.setValue('');
  }

  public limpiarCategoria() {
    this.categoriaSeleccionada.set(null);
    this.categoria.setValue('');
  }

  public ngOnDestroy() {
    if (this.pikaday) {
      this.pikaday.destroy();
    }
  }
}
