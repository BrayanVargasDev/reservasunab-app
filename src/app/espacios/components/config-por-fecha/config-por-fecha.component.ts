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
  FormArray,
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
import { format } from 'date-fns';

import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { FranjaHoraria, Configuracion } from '@espacios/interfaces';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ConfigPorFechaService } from '@espacios/services/config-por-fecha.service';
import { BotonAcciones } from '@shared/interfaces';
import { AlertasService } from '@shared/services/alertas.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfiguracionFormComponent } from '../configuracion-form/configuracion-form.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { ConfigBaseService } from '@espacios/services/config-base.service';
import { AuthService } from '@auth/services/auth.service';

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
  public espacioConfigService = inject(EspaciosConfigService);
  private configuracionService = inject(ConfigBaseService);
  private configPorFechaService = inject(ConfigPorFechaService);
  private alertasService = inject(AlertasService);
  private injector = inject(Injector);

  public authService = inject(AuthService);
  public fecha = new FormControl('');
  public fechaSeleccionada = signal<string>('');
  public pikaday!: Pikaday;
  public cargandoConfiguracion = signal<boolean>(false);
  public configuracionCargada = signal<boolean>(false);
  public necesitaConfiguracionBase = signal<boolean>(false);

  public configuracionForm: FormGroup = this.fb.group({
    id: [null],
    id_espacio: [this.espacioConfigService.idEspacio(), []],
    fecha: ['', [Validators.required]],
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
    franjas_horarias: this.fb.array<FranjaHoraria>([]),
  });

  public fechaPicker =
    viewChild.required<ElementRef<HTMLInputElement>>('fechaPicker');

  // Signal que escucha los cambios del servicio de fecha
  public fechaDelServicio = this.configPorFechaService.fecha;

  ngOnInit() {
    this.initializePikaday();

    effect(
      () => {
        this.espacioConfigService.pestana();

        this.resetFormulario();
        this.fecha.setValue('');
        this.fechaSeleccionada.set('');
        this.pikaday.setDate(null);
        this.configuracionCargada.set(false);
        this.necesitaConfiguracionBase.set(false);
        this.cargandoConfiguracion.set(false);
        this.configPorFechaService.setFechaSeleccionada(null);
        this.espacioConfigService.resetAll();
      },
      {
        injector: this.injector,
      },
    );

    // Effect que escucha cambios en la fecha del servicio
    effect(
      () => {
        const fechaSeleccionada = this.fechaDelServicio();

        if (fechaSeleccionada) {
          this.fechaSeleccionada.set(fechaSeleccionada);
          this.getConfiguracionPorFecha();
        } else {
          this.fechaSeleccionada.set('');
          this.configuracionCargada.set(false);
          this.necesitaConfiguracionBase.set(false);
          this.resetFormulario();
        }
      },
      {
        injector: this.injector,
      },
    );

    effect(
      () => {
        this.espacioConfigService.pestana();

        this.resetFormulario();
        this.fecha.setValue('');
        this.fechaSeleccionada.set('');
        this.pikaday.setDate(null);
        this.configuracionCargada.set(false);
        this.necesitaConfiguracionBase.set(false);
        this.cargandoConfiguracion.set(false);
      },
      {
        injector: this.injector,
      },
    );
  }

  private initializePikaday() {
    this.pikaday = new Pikaday({
      field: this.fechaPicker()?.nativeElement,
      minDate: new Date(),
      i18n: i18nDatePicker,
      format: 'DD/MM/YYYY',
      onSelect: (date: Date) => {
        this.configPorFechaService.setFechaSeleccionada(
          format(date, 'yyyy-MM-dd'),
        );
        this.fecha.setValue(format(date, 'dd/MM/yyyy'));
      },
    });
  }

  private getConfiguracionPorFecha() {
    this.cargandoConfiguracion.set(true);
    this.configuracionCargada.set(false);
    this.necesitaConfiguracionBase.set(false);

    this.configPorFechaService
      .obtenerConfiguracionPorFecha()
      .then(response => {
        if (response.error) {
          // Si hay un error específico sobre configuración base faltante
          if (
            response.message &&
            response.message.includes('configuración base')
          ) {
            this.necesitaConfiguracionBase.set(true);
            this.configuracionCargada.set(false);
          } else {
            this.alertasService.error(
              Object.values(response.errors || {}).join(', '),
              5000,
              this.espacioConfigService.alertaEspacioConfigRef()!,
            );
            this.configuracionCargada.set(false);
          }
          return;
        }

        if (response.data && response.data) {
          const data = response.data;
          this.configuracionForm.patchValue({
            id: data.id,
            fecha: this.fecha.value,
            id_espacio: data.id_espacio,
            minutos_uso: data.minutos_uso,
            dias_previos_apertura: data.dias_previos_apertura,
            hora_apertura: data.hora_apertura,
            tiempo_cancelacion: data.tiempo_cancelacion,
          });

          const franjasArray = this.configuracionForm.get(
            'franjas_horarias',
          ) as FormArray;
          franjasArray.clear();

          if (data.franjas_horarias?.length) {
            data.franjas_horarias.forEach(franja => {
              const franjaForm = this.fb.group({
                id: [franja.id],
                hora_inicio: [franja.hora_inicio],
                hora_fin: [franja.hora_fin],
                valor: [franja.valor],
                activa: [franja.activa],
              });
              franjasArray.push(franjaForm);
            });
          }

          this.configuracionCargada.set(true);
        } else {
          this.necesitaConfiguracionBase.set(true);
          this.configuracionCargada.set(false);
        }
      })
      .catch(error => {
        if (error.message && error.message.includes('configuración base')) {
          this.necesitaConfiguracionBase.set(true);
          this.configuracionCargada.set(false);
        } else {
          this.alertasService.error(
            Object.values(error.errors || {}).join(', '),
            5000,
            this.espacioConfigService.alertaEspacioConfigRef()!,
          );
          this.configuracionCargada.set(false);
        }
      })
      .finally(() => {
        this.cargandoConfiguracion.set(false);
      });
  }

  private resetFormulario() {
    this.configuracionForm.reset({
      id: null,
      id_espacio: this.espacioConfigService.idEspacio(),
      fecha: '',
      minutos_uso: '',
      dias_previos_apertura: '',
      hora_apertura: '',
      tiempo_cancelacion: '',
    });
  }

  public limpiarFecha() {
    this.configPorFechaService.setFechaSeleccionada(null);
    this.pikaday.setDate(null);
    this.fecha.setValue('');
  }

  public irAConfiguracionBase() {
    this.espacioConfigService.setPestana('base');
  }

  public agregarFranja(event: { dia: number; franja: any }) {
    const franjasFormArray = this.configuracionForm.get(
      'franjas_horarias',
    ) as FormArray;
    if (franjasFormArray) {
      franjasFormArray.push(this.fb.control(event.franja));
    }
  }

  public eliminarFranja(event: { dia: number; index: number }) {
    const franjasFormArray = this.configuracionForm.get(
      'franjas_horarias',
    ) as FormArray;
    if (
      franjasFormArray &&
      event.index >= 0 &&
      event.index < franjasFormArray.length
    ) {
      franjasFormArray.removeAt(event.index);
    }
  }

  public async guardarConfiguracion() {
    const form = this.configuracionForm;
    if (!form.valid) {
      return;
    }

    try {
      const configuracion: Configuracion = {
        ...form.value,
        id_espacio: this.espacioConfigService.idEspacio(),
        franjas_horarias: form.get('franjas_horarias')?.value || [],
        fecha: this.fechaSeleccionada(),
      };

      delete configuracion.dia_semana;

      await this.configuracionService.saveConfigMutation.mutateAsync(
        configuracion,
      );

      this.alertasService.success(
        'Configuración guardada correctamente',
        3000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } catch (error) {
      console.error('Error guardando configuración:', error);
      this.alertasService.error(
        'Error al guardar la configuración',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  ngOnDestroy() {
    // Destruir Pikaday al destruir el componente
    if (this.pikaday) {
      this.pikaday.destroy();
    }
  }
}
