import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectionStrategy,
  Injector,
  viewChild,
  ElementRef,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  createAngularTable,
  type ColumnDef,
  flexRenderComponent,
  FlexRenderDirective,
} from '@tanstack/angular-table';

import Pikaday from 'pikaday';
import { format, parse, isBefore, isAfter } from 'date-fns';
import { FranjaHoraria } from '@espacios/interfaces';
import { BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AuthService } from '@auth/services/auth.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';

@Component({
  selector: 'configuracion-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexRenderDirective,
    WebIconComponent,
    AccionesTablaComponent,
    ResponsiveTableDirective,
  ],
  templateUrl: './configuracion-form.component.html',
  styleUrl: './configuracion-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionFormComponent<T> {
  private HORA_APERTURA = '05:00';
  private injector = inject(Injector);
  private espacioConfigService = inject(EspaciosConfigService);
  configuracionForm = input.required<FormGroup>();
  diaNumero = input.required<number>();
  permisoFranjas = input.required<boolean>();
  permisoEliminarFranja = input.required<boolean>();

  agregarFranja = output<{ dia: number; franja: any }>();
  eliminarFranja = output<{ dia: number; index: number }>();

  public authService = inject(AuthService);
  public horaInicio = new FormControl('', [Validators.required]);
  public horaFin = new FormControl('', [Validators.required]);
  public valor = new FormControl('', [Validators.required, Validators.min(0)]);

  public modoCreacion = signal(false);

  private minutosUsoSignal = computed(() => {
    const form = this.configuracionForm();
    if (!form) return 60;

    this.formChangesSignal();
    const valor = form.get('minutos_uso')?.value || 60;
    return valor;
  });

  private horaAperturaSignal = computed(() => {
    const form = this.configuracionForm();
    if (!form) return this.HORA_APERTURA;

    this.formChangesSignal();
    const valor = this.HORA_APERTURA;
    return valor;
  });

  private franjasHorariasSignal = computed(() => {
    const form = this.configuracionForm();
    if (!form) return [];

    this.formChangesSignal();
    const franjasFormArray = form.get('franjas_horarias') as FormArray;
    return franjasFormArray?.value || [];
  });

  private formChangesSignal = signal(0);

  private horaInicioSignal = toSignal(this.horaInicio.valueChanges, {
    initialValue: null as string | null,
  });

  public opcionesTiempo = computed(() => {
    const minutosUso = +this.minutosUsoSignal();
    const apertura24 = this.horaAperturaSignal();
    const franjasExistentes = this.franjasHorariasSignal();

    if (!apertura24 || !minutosUso || minutosUso <= 0) return [];

    try {
      const [h0, m0] = apertura24
        .split(':')
        .map((n: string) => parseInt(n, 10));

      if (h0 < 0 || h0 > 23 || m0 < 0 || m0 > 59) return [];

      const todasLasOpciones: string[] = [];
      let totalMinutos = h0 * 60 + m0;
      const maxMinutos = 24 * 60;

      while (totalMinutos < maxMinutos) {
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        const d = new Date(1970, 0, 1, horas, minutos, 0);
        todasLasOpciones.push(format(d, 'hh:mm a'));
        totalMinutos += minutosUso;
      }

      return todasLasOpciones.filter(opcion => {
        const hora24 = this.convertirHoraA24(opcion);
        return !this.estaHoraOcupada(hora24, franjasExistentes);
      });
    } catch (error) {
      console.error('Error generando opciones de tiempo:', error);
      return [];
    }
  });

  public opcionesTiempoFin = computed(() => {
    const inicio24 = this.horaInicioSignal()
      ? this.convertirHoraA24(this.horaInicioSignal()!)
      : null;
    if (!inicio24) return [];

    const minutosUso = +this.minutosUsoSignal();
    const franjasExistentes = this.franjasHorariasSignal();

    try {
      const [h, m] = inicio24.split(':').map(n => parseInt(n, 10));

      if (h < 0 || h > 23 || m < 0 || m > 59) return [];

      const todasLasOpciones: string[] = [];
      let totalMinutos = h * 60 + m + minutosUso;
      const maxMinutos = 24 * 60;

      while (totalMinutos <= maxMinutos) {
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        if (horas >= 24) break;

        const d = new Date(1970, 0, 1, horas, minutos, 0);
        todasLasOpciones.push(format(d, 'hh:mm a'));
        totalMinutos += minutosUso;
      }

      return todasLasOpciones.filter(opcion => {
        const horaFin24 = this.convertirHoraA24(opcion);
        return !this.validarSolapamientoRango(
          inicio24,
          horaFin24,
          franjasExistentes,
        );
      });
    } catch (error) {
      console.error('Error generando opciones de tiempo:', error);
      return [];
    }
  });

  public accionesNuevaFranja = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      eventoClick: () => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      eventoClick: () => this.onGuardarNueva(),
    },
  ]);

  public columnasPorDefecto = signal<ColumnDef<FranjaHoraria>[]>([
    {
      id: 'hora_inicio',
      header: 'Hora Inicio',
      accessorKey: 'hora_inicio',
      cell: info => {
        const d = parse(info.getValue() as string, 'HH:mm', new Date());
        return format(d, 'hh:mm a');
      },
    },
    {
      id: 'hora_fin',
      header: 'Hora Fin',
      accessorKey: 'hora_fin',
      cell: info => {
        const d = parse(info.getValue() as string, 'HH:mm', new Date());
        return format(d, 'hh:mm a');
      },
    },
    {
      id: 'valor',
      header: 'Valor',
      accessorKey: 'valor',
      cell: info => `$${info.getValue()?.toLocaleString() || 0}`,
    },
    {
      id: 'estado',
      header: 'Estado',
      accessorKey: 'activa',
      cell: info =>
        `<span class="badge ${
          info.getValue() ? 'badge-success' : 'badge-error'
        } badge-sm py-1">${info.getValue() ? 'Activa' : 'Inactiva'}</span>`,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const franja = context.row.original;
        const acciones: BotonAcciones[] = this.permisoEliminarFranja()
          ? [
              {
                tooltip: 'Eliminar',
                icono: 'remove-circle-outline',
                color: 'error',
                eventoClick: (event: Event) =>
                  this.eliminarFranjaLocal(franja, context.row.index),
              },
            ]
          : [];

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            acciones,
          },
        });
      },
    },
  ]);

  public tablaTarifas = createAngularTable(() => ({
    data: this.franjasHorariasSignal(),
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  }));

  fechaPicker = viewChild.required<ElementRef<HTMLInputElement>>('fechaPicker');
  private pickaFecha!: Pikaday;

  ngOnInit() {
    const form = this.configuracionForm();

    if (!form.get('minutos_uso')?.value) {
      form.patchValue({
        minutos_uso: 60,
        dias_previos_apertura: 3,
        hora_apertura: this.HORA_APERTURA,
        tiempo_cancelacion: 60,
      });
    }

    form.get('minutos_uso')?.valueChanges.subscribe(() => {
      this.formChangesSignal.update(val => val + 1);
    });

    form.get('hora_apertura')?.valueChanges.subscribe(() => {
      this.formChangesSignal.update(val => val + 1);
    });

    const franjasFormArray = form.get('franjas_horarias') as FormArray;
    if (franjasFormArray) {
      franjasFormArray.valueChanges.subscribe(() => {
        this.formChangesSignal.update(val => val + 1);
      });
    }

    effect(
      () => {
        this.horaInicioSignal();

        if (this.horaInicio.value) {
          this.horaFin.enable();
        } else {
          this.horaFin.disable();
        }
      },
      {
        injector: this.injector,
      },
    );

    effect(
      () => {
        this.horaAperturaSignal();
        this.minutosUsoSignal();

        if (this.horaInicio.value) {
          this.horaInicio.reset();
          this.horaFin.reset();
          this.horaFin.disable();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  public actualizarFranjasSignal() {
    this.formChangesSignal.update(val => val + 1);
  }

  public onCancelarFecha() {
    this.pickaFecha.setDate(null);
    this.modoCreacion.set(false);
  }

  public nuevaFranja() {
    this.modoCreacion.set(true);
    this.espacioConfigService.setCrandoFranja(true);
  }

  private cancelarCreacion() {
    this.resetearFormularioCreacion();
    this.espacioConfigService.setCrandoFranja(false);
  }

  public eliminarFranjaLocal(franja: FranjaHoraria, index: number) {
    this.eliminarFranja.emit({ dia: this.diaNumero(), index });
  }

  private onGuardarNueva() {
    if (this.horaInicio.valid && this.horaFin.valid && this.valor.valid) {
      const nuevaFranja = {
        hora_inicio: this.convertirHoraA24(this.horaInicio.value!),
        hora_fin: this.convertirHoraA24(this.horaFin.value!),
        valor: +this.valor.value!,
        activa: true,
      };

      const franjasExistentes = this.franjasHorariasSignal();
      const solapamiento = this.validarSolapamientoRango(
        nuevaFranja.hora_inicio,
        nuevaFranja.hora_fin,
        franjasExistentes,
      );

      if (solapamiento) {
        console.error(
          'El horario ingresado se solapa con un horario existente.',
        );
        return;
      }

      this.agregarFranja.emit({
        dia: this.diaNumero(),
        franja: nuevaFranja,
      });
      this.espacioConfigService.setCrandoFranja(false);
      this.resetearFormularioCreacion();
    }
  }

  private convertirHoraA24(hora12: string): string {
    const d = parse(hora12, 'hh:mm a', new Date());
    return format(d, 'HH:mm');
  }

  private estaHoraOcupada(
    hora24: string,
    franjasExistentes: FranjaHoraria[],
  ): boolean {
  const horaDate = parse(hora24, 'HH:mm', new Date());

    return franjasExistentes.some((franja: FranjaHoraria) => {
      const inicioExistente = parse(franja.hora_inicio, 'HH:mm', new Date());
      const finExistente = parse(franja.hora_fin, 'HH:mm', new Date());

      return (
        (!isBefore(horaDate, inicioExistente)) &&
        isBefore(horaDate, finExistente)
      );
    });
  }

  private validarSolapamientoRango(
    horaInicio: string,
    horaFin: string,
    franjasExistentes: FranjaHoraria[],
  ): boolean {
  const inicioNueva = parse(horaInicio, 'HH:mm', new Date());
  const finNueva = parse(horaFin, 'HH:mm', new Date());

    return franjasExistentes.some((franja: FranjaHoraria) => {
  const inicioExistente = parse(franja.hora_inicio, 'HH:mm', new Date());
  const finExistente = parse(franja.hora_fin, 'HH:mm', new Date());

  return isBefore(inicioNueva, finExistente) && isAfter(finNueva, inicioExistente);
    });
  }

  public resetearFormularioCreacion() {
    this.horaInicio.reset();
    this.horaFin.reset();
    this.valor.reset();
    this.modoCreacion.set(false);
  }

  ngOnDestroy() {
    if (this.pickaFecha) this.pickaFecha.destroy();
  }
}
