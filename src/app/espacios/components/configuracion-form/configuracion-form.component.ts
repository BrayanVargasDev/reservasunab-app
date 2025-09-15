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
  TemplateRef,
  ChangeDetectorRef,
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
  ExpandedState,
} from '@tanstack/angular-table';

import Pikaday from 'pikaday';
import { format, parse, isBefore, isAfter } from 'date-fns';
import { FranjaHoraria } from '@espacios/interfaces';
import { BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { AuthService } from '@auth/services/auth.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { AppService } from '@app/app.service';
import { CellContext } from '@tanstack/angular-table';
import { UpperFirstPipe } from '@shared/pipes';
import { ro } from 'date-fns/locale';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'configuracion-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexRenderDirective,
    WebIconComponent,
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
  private cdr = inject(ChangeDetectorRef);

  configuracionForm = input.required<FormGroup>();
  diaNumero = input.required<number>();
  permisoFranjas = input.required<boolean>();
  permisoEliminarFranja = input.required<boolean>();

  agregarFranja = output<{ dia: number; franja: any }>();
  eliminarFranja = output<{ dia: number; index: number }>();

  public authService = inject(AuthService);
  public appService = inject(AppService);
  public horaInicio = new FormControl('', [Validators.required]);
  public horaFin = new FormControl('', [Validators.required]);
  public valor = new FormControl('', [Validators.required, Validators.min(0)]);

  public modoCreacion = signal(false);

  public horaInicioCellTemplate =
    viewChild.required<TemplateRef<Util>>('horaInicioCell');
  public horaFinCellTemplate =
    viewChild.required<TemplateRef<Util>>('horaFinCell');
  public valorCellTemplate = viewChild.required<TemplateRef<Util>>('valorCell');

  public filaFranjaEditando = signal<Record<number, boolean>>({});

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

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
    const franjasExistentes = this.franjasHorariasSignal().filter(
      (f: FranjaHoraria) => !this.filaFranjaEditando()[f.id!],
    );

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
    const franjasExistentes = this.franjasHorariasSignal().filter(
      (f: FranjaHoraria) => !this.filaFranjaEditando()[f.id!],
    );

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
      disabled: this.appService.guardando(),
      eventoClick: () => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      disabled: this.appService.guardando(),
      eventoClick: () => this.onGuardarNueva(),
    },
  ]);

  public columnasPorDefecto = signal<ColumnDef<FranjaHoraria>[]>([
    {
      id: 'expansor',
      header: '',
      size: 40,
      meta: {
        priority: Infinity,
      },
      cell: context =>
        flexRenderComponent(TableExpansorComponent, {
          inputs: {
            isExpanded: context.row.getIsExpanded(),
            disabled: this.appService.editando(),
          },
          outputs: {
            toggleExpand: () => this.onToggleRow(context.row),
          },
        }),
    },
    {
      id: 'hora_inicio',
      accessorKey: 'hora_inicio',
      header: 'Hora Inicio',
      meta: {
        priority: 2,
      },
      size: 150,
      accessorFn: row => {
        // Convertir de 24h a 12h para mostrar
        const d = parse(row.hora_inicio, 'HH:mm', new Date());
        return format(d, 'hh:mm a');
      },
      cell: this.horaInicioCellTemplate,
    },
    {
      id: 'hora_fin',
      header: 'Hora Fin',
      accessorFn: row => {
        // Convertir de 24h a 12h para mostrar
        const d = parse(row.hora_fin, 'HH:mm', new Date());
        return format(d, 'hh:mm a');
      },
      accessorKey: 'hora_fin',
      size: 150,
      cell: this.horaFinCellTemplate,
    },
    {
      id: 'valor',
      header: 'Valor',
      meta: {
        priority: 1,
      },
      size: 150,
      accessorKey: 'valor',
      cell: this.valorCellTemplate,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const franja = context.row.original;
        const id = franja.id!;

        if (id === -1) {
          return flexRenderComponent(AccionesTablaComponent, {
            inputs: {
              acciones: this.accionesNuevaFranja(),
            },
          });
        }

        const enEdicion = this.filaFranjaEditando()[id] && !this.modoCreacion();

        const acciones: BotonAcciones[] = [];

        if (enEdicion) {
          acciones.push(
            {
              tooltip: 'Cancelar',
              icono: 'remove-circle-outline',
              color: 'error',
              disabled: this.appService.guardando(),
              eventoClick: (event: Event) => this.onCancelarEdicionFranja(id),
            },
            {
              tooltip: 'Guardar',
              icono: 'save-outline',
              color: 'success',
              disabled: this.appService.guardando(),
              eventoClick: (event: Event) => this.onGuardarEdicionFranja(id),
            },
          );
        } else {
          acciones.push({
            tooltip: 'Editar',
            icono: 'pencil-outline',
            color: 'accent',
            disabled: this.appService.editando() || this.appService.guardando(),
            eventoClick: (event: Event) => this.iniciarEdicionFranja(id),
          });

          if (this.permisoEliminarFranja()) {
            acciones.push({
              tooltip: 'Eliminar',
              icono: 'remove-circle-outline',
              color: 'error',
              disabled:
                this.appService.editando() || this.appService.guardando(),
              eventoClick: (event: Event) =>
                this.eliminarFranjaLocal(franja, context.row.index),
            });
          }
        }

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            acciones,
          },
        });
      },
    },
  ]);

  public tablaTarifas = createAngularTable(() => ({
    data: this.franjasQuery(),
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    autoResetExpanded: false,
    state: {
      expanded: this.tableState().expanded,
    },
    onExpandedChange: estado => {
      const newExpanded =
        typeof estado === 'function'
          ? estado(this.tableState().expanded)
          : estado;

      this.tableState.update(state => ({
        ...state,
        expanded: newExpanded,
      }));
    },
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

    // Efecto para mantener coherencia del campo valor según aprobar_reservas
    effect(
      () => {
        const aprobar =
          this.espacioConfigService.espacioQuery.data()?.aprobar_reserva;
        // Si está en modo creación y requiere aprobación, fijar en 0 y deshabilitar
        if (this.modoCreacion() && aprobar) {
          this.valor.setValue('0', { emitEvent: false });
          this.valor.disable({ emitEvent: false });
        } else if (this.modoCreacion() && !aprobar) {
          if (this.valor.disabled) this.valor.enable({ emitEvent: false });
        }
      },
      { injector: this.injector },
    );
  }

  public actualizarFranjasSignal() {
    this.formChangesSignal.update(val => val + 1);
  }

  public franjasQuery = computed<FranjaHoraria[]>(() => {
    const franjas = this.franjasHorariasSignal();

    if (this.modoCreacion()) {
      const franjaVacia: FranjaHoraria = {
        id: -1,
        hora_inicio: '',
        hora_fin: '',
        valor: 0,
        activa: true,
      };
      return [franjaVacia, ...franjas];
    }
    return franjas;
  });

  public onToggleRow(row: any, editing = false) {
    const rowId = row.id;
    const currentExpanded = this.tableState().expanded as Record<
      string,
      boolean
    >;

    let newExpanded: Record<string, boolean>;

    if (editing) {
      newExpanded = { [rowId]: true };
    } else {
      newExpanded = currentExpanded[rowId] ? {} : { [rowId]: true };
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  public onCancelarFecha() {
    this.pickaFecha.setDate(null);
    this.modoCreacion.set(false);
  }

  public nuevaFranja() {
    this.modoCreacion.set(true);
    this.espacioConfigService.setCrandoFranja(true);
    this.appService.setEditando(false);
    this.filaFranjaEditando.set({});

    const aprobar =
      this.espacioConfigService.espacioQuery.data()?.aprobar_reserva;
    if (aprobar) {
      this.valor.setValue('0', { emitEvent: false });
      this.valor.disable({ emitEvent: false });
    } else {
      if (this.valor.disabled) this.valor.enable({ emitEvent: false });
      this.valor.reset();
    }
  }

  private cancelarCreacion() {
    this.resetearFormularioCreacion();
    this.espacioConfigService.setCrandoFranja(false);
  }

  public eliminarFranjaLocal(franja: FranjaHoraria, index: number) {
    this.eliminarFranja.emit({ dia: this.diaNumero(), index });
  }

  private onGuardarNueva() {
    const aprobar =
      this.espacioConfigService.espacioQuery.data()?.aprobar_reserva;
    if (
      this.horaInicio.valid &&
      this.horaFin.valid &&
      (this.valor.valid || aprobar)
    ) {
      const nuevaFranja = {
        hora_inicio: this.convertirHoraA24(this.horaInicio.value!),
        hora_fin: this.convertirHoraA24(this.horaFin.value!),
        valor: aprobar ? 0 : +this.valor.value!,
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
        !isBefore(horaDate, inicioExistente) && isBefore(horaDate, finExistente)
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

      return (
        isBefore(inicioNueva, finExistente) &&
        isAfter(finNueva, inicioExistente)
      );
    });
  }

  public resetearFormularioCreacion() {
    this.horaInicio.reset();
    this.horaFin.reset();
    this.valor.reset();
    this.modoCreacion.set(false);
    // Rehabilitar control valor tras cancelar (si no se requiere aprobación)
    const aprobar =
      this.espacioConfigService.espacioQuery.data()?.aprobar_reserva;
    if (!aprobar && this.valor.disabled)
      this.valor.enable({ emitEvent: false });
  }

  // Métodos para edición inline de franjas
  public iniciarEdicionFranja(id: number) {
    const franjas = this.franjasQuery();
    const franja = franjas.find((f: FranjaHoraria) => f.id === id);

    if (franja) {
      this.horaInicio.setValue(this.convertirHoraA12(franja.hora_inicio));
      this.horaFin.setValue(this.convertirHoraA12(franja.hora_fin));
      this.valor.setValue(franja.valor?.toString() || '');

      this.filaFranjaEditando.update(state => ({ ...state, [id]: true }));
      this.appService.setEditando(true);
      const index = franjas.findIndex((f: FranjaHoraria) => f.id === id);
      this.onToggleRow({ id: index.toString() }, true);
    }
  }

  public onCancelarEdicionFranja(id: number) {
    this.filaFranjaEditando.update(state => ({ ...state, [id]: false }));
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    // Limpiar controles de edición
    this.horaInicio.reset();
    this.horaFin.reset();
    this.valor.reset();
  }

  public onGuardarEdicionFranja(id: number) {
    if (this.horaInicio.invalid || this.horaFin.invalid || this.valor.invalid) {
      return;
    }

    const franjas = this.franjasHorariasSignal();
    const franjaOriginal = franjas.find((f: FranjaHoraria) => f.id === id);
    const index = franjas.findIndex((f: FranjaHoraria) => f.id === id);

    if (!franjaOriginal || index === -1) return;

    const franjaActualizada = {
      ...franjaOriginal,
      hora_inicio: this.convertirHoraA24(this.horaInicio.value!),
      hora_fin: this.convertirHoraA24(this.horaFin.value!),
      valor: +this.valor.value!,
    };

    // Validar solapamiento con otras franjas
    const otrasFranjas = franjas.filter(
      (_: FranjaHoraria, i: number) => i !== index,
    );
    const solapamiento = this.validarSolapamientoRango(
      franjaActualizada.hora_inicio,
      franjaActualizada.hora_fin,
      otrasFranjas,
    );

    if (solapamiento) {
      console.error(
        'El horario modificado se solapa con un horario existente.',
      );
      return;
    }

    // Actualizar el FormArray
    const form = this.configuracionForm();
    const franjasArray = form.get('franjas_horarias') as FormArray;
    franjasArray.at(index).patchValue(franjaActualizada);

    this.onCancelarEdicionFranja(id);
  }

  private convertirHoraA12(hora24: string): string {
    const d = parse(hora24, 'HH:mm', new Date());
    return format(d, 'hh:mm a');
  }

  ngOnDestroy() {
    if (this.pickaFecha) this.pickaFecha.destroy();
  }
}
