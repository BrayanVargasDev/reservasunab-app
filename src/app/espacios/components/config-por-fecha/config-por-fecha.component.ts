import {
  Component,
  type OnInit,
  type OnDestroy,
  type AfterViewInit,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  viewChild,
  ViewContainerRef,
  signal,
  computed,
  effect,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  type ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FlexRenderDirective,
  getExpandedRowModel,
  flexRenderComponent,
} from '@tanstack/angular-table';
import Pikaday from 'pikaday';
import moment from 'moment';

import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { FranjaHoraria } from '@espacios/interfaces';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ConfigPorFechaService } from '@espacios/services/config-por-fecha.service';
import { BotonAcciones } from '@shared/interfaces';
import { AlertasService } from '@shared/services/alertas.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfiguracionFormComponent } from '../configuracion-form/configuracion-form.component';

@Component({
  selector: 'config-por-fecha',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebIconComponent,
    ConfiguracionFormComponent,
  ],
  templateUrl: './config-por-fecha.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ConfigPorFechaComponent {
  private fb = inject(FormBuilder);
  private espacioConfigService = inject(EspaciosConfigService);
  private configPorFechaService = inject(ConfigPorFechaService);
  private alertasService = inject(AlertasService);
  private injector = inject(Injector);

  public fecha = new FormControl('');
  public fechaSeleccionada = signal<string>('');

  public configuracionForm: FormGroup = this.fb.group({
    minutos_uso: ['', [Validators.required, Validators.min(15)]],
    dias_previos_apertura: [
      '',
      [Validators.required, Validators.min(1), Validators.max(30)],
    ],
    hora_apertura: ['', [Validators.required]],
    tiempo_cancelacion: [
      '',
      [Validators.required, Validators.min(30), Validators.max(1440)],
    ],
  });
}
