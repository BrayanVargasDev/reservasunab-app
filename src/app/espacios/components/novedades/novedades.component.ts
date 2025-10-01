import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  Injector,
  viewChild,
  TemplateRef,
  ChangeDetectorRef,
  ViewContainerRef,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {
  type ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  FlexRenderDirective,
  getExpandedRowModel,
  flexRenderComponent,
  type Row,
  type CellContext,
  type ExpandedState,
  type PaginationState,
} from '@tanstack/angular-table';
import Pikaday from 'pikaday';
import { format, parse, isBefore } from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';

import { NovedadesService } from '@espacios/services/novedades.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { AuthService } from '@auth/services/auth.service';
import { AlertasService } from '@shared/services/alertas.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { UpperFirstPipe } from '@shared/pipes/upper-first.pipe';
import { Novedad } from '@espacios/interfaces/novedad.interface';
import { BotonAcciones } from '@shared/interfaces';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';
import { AppService } from '@app/app.service';
import { PERMISOS_ESPACIOS } from '@shared/constants';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'novedades',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WebIconComponent,
    ResponsiveTableDirective,
    FlexRenderDirective,
    PaginadorComponent,
    UpperFirstPipe,
  ],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovedadesComponent implements OnInit, OnDestroy, AfterViewInit {
  private injector = inject(Injector);
  private alertasService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);

  public novedadesService = inject(NovedadesService);
  public espacioConfigService = inject(EspaciosConfigService);
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public estilosAlerta =
    'fixed flex p-4 transition-all ease-in-out bottom-4 right-4';

  // Constantes de permisos
  readonly permisos = PERMISOS_ESPACIOS;

  // Instancias de Pikaday
  private pikadayInicio!: Pikaday;
  private pikadayFin!: Pikaday;

  // Computed properties que usan el servicio
  public modoCreacion = computed(() => this.novedadesService.modoCreacion());
  public fechaActual = computed(() =>
    formatInBogota(new Date(), 'dd/MM/yyyy HH:mm a'),
  );

  // Form controls - solo para crear/editar novedades
  public fechaInicio = new FormControl<string>('', [Validators.required]);
  public fechaFin = new FormControl<string>('');
  public horaInicio = new FormControl<string>('', [Validators.required]);
  public horaFin = new FormControl<string>('', [Validators.required]);
  public descripcion = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(13),
  ]);

  constructor() {
    this.descripcion.valueChanges.subscribe(value => {
      if (value && value.length > 13) {
        this.descripcion.setValue(value.slice(0, 13), { emitEvent: false });
      }
    });
  }

  public novedadEnEdicion = signal<Novedad | null>(null);

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public fechaInicioCell =
    viewChild.required<TemplateRef<Util>>('fechaInicioCell');
  public fechaFinCell = viewChild.required<TemplateRef<Util>>('fechaFinCell');
  public horaInicioCell =
    viewChild.required<TemplateRef<Util>>('horaInicioCell');
  public horaFinCell = viewChild.required<TemplateRef<Util>>('horaFinCell');
  public descripcionCell =
    viewChild.required<TemplateRef<Util>>('descripcionCell');

  public fechaInicioPicker =
    viewChild<ElementRef<HTMLInputElement>>('fechaInicioPicker');
  public fechaFinPicker =
    viewChild<ElementRef<HTMLInputElement>>('fechaFinPicker');

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  public paginacion = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  private columnasPorDefecto = signal<ColumnDef<Novedad>[]>([
    {
      id: 'expansor',
      header: '',
      size: 40,
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
      id: 'fecha_inicio',
      accessorKey: 'fecha_inicio',
      header: 'Fecha Inicio',
      size: 120,
      cell: this.fechaInicioCell,
    },
    {
      id: 'fecha_fin',
      accessorKey: 'fecha_fin',
      header: 'Fecha Fin',
      size: 120,
      cell: this.fechaFinCell,
    },
    {
      id: 'hora_inicio',
      accessorKey: 'hora_inicio',
      header: 'Hora Inicio',
      size: 100,
      cell: this.horaInicioCell,
    },
    {
      id: 'hora_fin',
      accessorKey: 'hora_fin',
      header: 'Hora Fin',
      size: 100,
      cell: this.horaFinCell,
    },
    {
      id: 'descripcion',
      accessorKey: 'descripcion',
      header: 'Descripción',
      size: 300,
      cell: this.descripcionCell,
    },
    {
      id: 'estado',
      accessorKey: 'eliminado_en',
      header: 'Estado',
      size: 200,
      cell: this.estadoCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      size: 150,
      cell: context => {
        const novedad = context.row.original;
        const id = novedad.id;

        // Si es la fila de creación (ID = -1)
        if (id === -1) {
          return flexRenderComponent(AccionesTablaComponent, {
            inputs: {
              acciones: [
                {
                  tooltip: 'Cancelar',
                  icono: 'remove-circle-outline',
                  color: 'error',
                  disabled: this.appService.guardando(),
                  eventoClick: (event: Event) => this.cancelarCreacion(),
                },
                {
                  tooltip: 'Guardar',
                  icono: 'save-outline',
                  color: 'success',
                  disabled: this.appService.guardando(),
                  eventoClick: (event: Event) => this.onGuardarNuevo(),
                },
              ],
            },
          });
        }

        // Para filas normales
        const enEdicion = this.novedadesService.filaEditando()[id];
        const accionesVerificadas = [];

        if (this.authService.tienePermisos(this.permisos.EDITAR_NOVEDADES_ESPACIO)) {
          accionesVerificadas.push({
            tooltip: 'Editar',
            icono: 'pencil-outline',
            color: 'accent',
            disabled: this.appService.editando() || this.appService.guardando(),
            eventoClick: (event: Event) => this.iniciarEdicion(context.row),
          });
        }

        const acciones: BotonAcciones[] = enEdicion
          ? [
              {
                tooltip: 'Cancelar',
                icono: 'remove-circle-outline',
                color: 'error',
                disabled: this.appService.guardando(),
                eventoClick: (event: Event) =>
                  this.onCancelarEdicion(context.row),
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
                disabled: this.appService.guardando(),
                eventoClick: (event: Event) =>
                  this.onGuardarEdicion(context.row),
              },
            ]
          : accionesVerificadas;

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            acciones,
          },
        });
      },
    },
  ]);

  readonly tablaNovedades = createAngularTable(() => ({
    data: this.novedadesQuery ?? [],
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    autoResetExpanded: false,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    state: {
      expanded: this.tableState().expanded,
      pagination: this.paginacion(),
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
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function' ? estado(this.paginacion()) : estado;

      this.paginacion.set(newPagination);
    },
  }));

  ngOnInit() {
    effect(
      () => {
        const modoCreacion = this.modoCreacion();
        const filasEditando = this.novedadesService.filaEditando();

        const hayFilaEditando = Object.values(filasEditando).some(
          editando => editando,
        );

        if (modoCreacion || hayFilaEditando) {
          setTimeout(() => {
            this.initializePikaday();
          }, 100);
        } else {
          if (!this.fechaInicio.value && !this.fechaFin.value) {
            this.limpiarFormulario();
          }
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  ngAfterViewInit() {
    // No inicializar Pikaday aquí ya que los elementos pueden no estar disponibles
    // Se inicializa en el effect cuando sea necesario
  }

  private initializePikaday() {
    if (
      !this.fechaInicioPicker()?.nativeElement ||
      !this.fechaFinPicker()?.nativeElement
    ) {
      return;
    }

    if (this.pikadayInicio) {
      this.pikadayInicio.destroy();
    }
    if (this.pikadayFin) {
      this.pikadayFin.destroy();
    }

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    const updateStartDate = () => {
      if (startDate && this.pikadayInicio && this.pikadayFin) {
        this.pikadayInicio.setStartRange(startDate);
        this.pikadayInicio.setEndRange(endDate);
        this.pikadayFin.setStartRange(startDate);
        this.pikadayFin.setMinDate(startDate);
        if (endDate) {
          this.pikadayFin.setEndRange(endDate);
        }
      }
    };

    const updateEndDate = () => {
      if (endDate && this.pikadayInicio && this.pikadayFin) {
        this.pikadayInicio.setEndRange(endDate);
        this.pikadayInicio.setMaxDate(endDate);
        this.pikadayFin.setEndRange(endDate);
        if (startDate) {
          this.pikadayInicio.setStartRange(startDate);
        }
      }
    };

    this.pikadayInicio = new Pikaday({
      field: this.fechaInicioPicker()?.nativeElement,
      format: 'DD/MM/YYYY',
      firstDay: 1,
      minDate: new Date(),
      yearRange: [new Date().getFullYear(), new Date().getFullYear() + 5],
      i18n: i18nDatePicker,
      onSelect: (date: Date) => {
        startDate = date;
        const formattedDate = format(startDate, 'dd/MM/yyyy');

        this.fechaInicio.setValue(formattedDate);
        this.fechaInicio.markAsTouched();

        if (endDate && isBefore(endDate, startDate)) {
          endDate = null;
          this.fechaFin.setValue('');
          if (this.pikadayFin) {
            this.pikadayFin.setDate(null);
          }
        }

        updateStartDate();
        this.cdr.detectChanges();
      },
    });

    this.pikadayFin = new Pikaday({
      field: this.fechaFinPicker()?.nativeElement,
      format: 'DD/MM/YYYY',
      firstDay: 1,
      minDate: new Date(),
      yearRange: [new Date().getFullYear(), new Date().getFullYear() + 5],
      i18n: i18nDatePicker,
      onSelect: (date: Date) => {
        endDate = date;
        const formattedDate = format(endDate, 'dd/MM/yyyy');

        // Actualizar el FormControl
        this.fechaFin.setValue(formattedDate);
        this.fechaFin.markAsTouched();

        updateEndDate();
        this.cdr.detectChanges();
      },
    });

    // Inicializar con valores existentes si los hay
    const existingStartDate = this.fechaInicio.value;
    const existingEndDate = this.fechaFin.value;

    if (existingStartDate) {
      startDate = parse(existingStartDate, 'dd/MM/yyyy', new Date());
      this.pikadayInicio.setDate(startDate);
      updateStartDate();
    }

    if (existingEndDate) {
      endDate = parse(existingEndDate, 'dd/MM/yyyy', new Date());
      this.pikadayFin.setDate(endDate);
      updateEndDate();
    }
  }

  private updatePikadayValues(fechaInicio: string, fechaFin: string) {
    if (this.pikadayInicio && fechaInicio) {
      const startDate = parse(fechaInicio, 'dd/MM/yyyy', new Date());
      this.pikadayInicio.setDate(startDate);
      this.pikadayInicio.setStartRange(startDate);
    }
    if (this.pikadayFin && fechaFin) {
      const endDate = parse(fechaFin, 'dd/MM/yyyy', new Date());
      this.pikadayFin.setDate(endDate);
      this.pikadayFin.setEndRange(endDate);

      // Establecer fecha mínima basada en fecha de inicio
      if (fechaInicio && this.pikadayInicio) {
        const startDate = parse(fechaInicio, 'dd/MM/yyyy', new Date());
        this.pikadayFin.setMinDate(startDate);
        this.pikadayFin.setStartRange(startDate);
        this.pikadayInicio.setEndRange(endDate);
        this.pikadayInicio.setMaxDate(endDate);
      }
    }
  }

  get novedadesQuery() {
    const novedades = this.novedadesService.novedadesQuery.data()?.data || [];

    if (this.modoCreacion()) {
      const novedadVacia: Novedad = {
        id: -1,
        id_espacio: this.espacioConfigService.idEspacio() || 0,
        fecha_inicio: '',
        fecha_fin: '',
        hora_inicio: '',
        hora_fin: '',
        descripcion: '',
        creado_en: this.fechaActual(),
        eliminado_en: null,
        creado_por: this.authService.usuario()!.id,
        actualizado_en: '',
        actualizado_por: null,
        eliminado_por: null,
      };
      return [novedadVacia, ...novedades];
    }
    return novedades;
  }

  private iniciarEdicion(row: Row<Novedad>) {
    const novedad = row.original;
    const id = novedad.id;

    this.novedadesService.setEditandoFila(id, true);
    this.novedadesService.setNovedadSeleccionada(novedad);
    this.appService.setEditando(true);

    setTimeout(() => {
      // Convertir fechas del formato del backend (YYYY-MM-DD) al formato de display (DD-MM-YYYY)
      const fechaInicioDisplay = format(
        parse(novedad.fecha_inicio, 'yyyy-MM-dd', new Date()),
        'dd/MM/yyyy',
      );
      const fechaFinDisplay = format(
        parse(novedad.fecha_fin, 'yyyy-MM-dd', new Date()),
        'dd/MM/yyyy',
      );

      this.fechaInicio.setValue(fechaInicioDisplay);
      this.fechaFin.setValue(fechaFinDisplay);
      this.horaInicio.setValue(novedad.hora_inicio);
      this.horaFin.setValue(novedad.hora_fin);
      this.descripcion.setValue(novedad.descripcion);

      this.fechaInicio.markAsPristine();
      this.fechaFin.markAsPristine();
      this.horaInicio.markAsPristine();
      this.horaFin.markAsPristine();
      this.descripcion.markAsPristine();

      // Actualizar valores en Pikaday
      this.updatePikadayValues(fechaInicioDisplay, fechaFinDisplay);

      this.onToggleRow(row, true);
      this.cdr.detectChanges();

      // El efecto se encargará de inicializar Pikaday automáticamente
    }, 0);
  }

  public onCancelarEdicion(row: Row<Novedad>) {
    const id = row.original.id;
    this.novedadesService.setEditandoFila(id, false);
    this.appService.setEditando(false);
    this.novedadesService.setNovedadSeleccionada(null);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    this.limpiarFormulario();
    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.novedadesService.setModoCreacion(false);
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    this.limpiarFormulario();
    this.cdr.detectChanges();
  }

  public async onGuardarNuevo() {
    this.marcarTodosTouched();

    if (this.formularioInvalido()) {
      this.alertasService.error(
        'Todos los campos son requeridos.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );
      return;
    }

    this.appService.setGuardando(true);

    // Convertir fechas del formato de display (DD-MM-YYYY) al formato del backend (YYYY-MM-DD)
    const fechaInicioBackend = format(
      parse(this.fechaInicio.value!, 'dd/MM/yyyy', new Date()),
      'yyyy-MM-dd',
    );
    const fechaFinBackend = this.fechaFin.value
      ? format(
          parse(this.fechaFin.value!, 'dd/MM/yyyy', new Date()),
          'yyyy-MM-dd',
        )
      : undefined;

    const nuevaNovedad: Partial<Novedad> = {
      fecha_inicio: fechaInicioBackend,
      fecha_fin: fechaFinBackend,
      hora_inicio: this.horaInicio.value!,
      hora_fin: this.horaFin.value!,
      descripcion: this.descripcion.value!,
    };

    try {
      await this.novedadesService.crearNovedad(nuevaNovedad);

      this.alertasService.success(
        'Novedad creada exitosamente.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );

      // Invalidar queries para refrescar la lista
      this.novedadesService.invalidarQueries();
      this.finalizarOperacion();
    } catch (error) {
      console.error('Error al crear novedad:', error);
      this.alertasService.error(
        'Error al crear la novedad. Intente de nuevo.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );
    } finally {
      this.appService.setGuardando(false);
    }
  }

  private async onGuardarEdicion(row: Row<Novedad>) {
    this.marcarTodosTouched();

    if (this.formularioInvalido()) {
      this.alertasService.error(
        'Complete los campos necesarios.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );
      return;
    }

    this.appService.setGuardando(true);

    const novedad = row.original;

    // Convertir fechas del formato de display (DD-MM-YYYY) al formato del backend (YYYY-MM-DD)
    const fechaInicioBackend = format(
      parse(this.fechaInicio.value!, 'dd/MM/yyyy', new Date()),
      'yyyy-MM-dd',
    );
    const fechaFinBackend = format(
      parse(this.fechaFin.value!, 'dd/MM/yyyy', new Date()),
      'yyyy-MM-dd',
    );

    const novedadActualizada: Partial<Novedad> = {
      fecha_inicio: fechaInicioBackend,
      fecha_fin: fechaFinBackend,
      hora_inicio: this.horaInicio.value!,
      hora_fin: this.horaFin.value!,
      descripcion: this.descripcion.value!,
    };

    try {
      await this.novedadesService.actualizarNovedad(novedad.id, {
        ...novedad,
        fecha_inicio: fechaInicioBackend,
        fecha_fin: fechaFinBackend,
        hora_inicio: this.horaInicio.value!,
        hora_fin: this.horaFin.value!,
        descripcion: this.descripcion.value!,
      });

      this.alertasService.success(
        'Novedad actualizada exitosamente.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );

      // Invalidar queries para refrescar la lista
      this.novedadesService.invalidarQueries();
      this.finalizarOperacion();
      this.novedadesService.setEditandoFila(novedad.id, false);
    } catch (error) {
      console.error('Error al actualizar novedad:', error);
      this.alertasService.error(
        'Error al actualizar la novedad. Intente de nuevo.',
        5000,
        this.espacioConfigService.alertaEspacioConfigRef()!,
        this.estilosAlerta,
      );
    } finally {
      this.appService.setGuardando(false);
    }
  }

  public cambiarEstadoNovedad(novedad: Novedad) {
    const nuevoEstado = novedad.eliminado_en === null ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.appService.setGuardando(true);
    this.cdr.detectChanges();

    this.alertasService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} esta novedad?`,
        this.espacioConfigService.alertaEspacioConfigRef()!!,
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} novedad`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(async confirmado => {
        if (confirmado) {
          try {
            await this.novedadesService.cambiarEstadoNovedad(
              novedad.id,
              nuevoEstado,
            );
            this.alertasService.success(
              `Novedad ${
                accion === 'activar' ? 'activada' : 'desactivada'
              } exitosamente.`,
              5000,
              this.espacioConfigService.alertaEspacioConfigRef()!,
              this.estilosAlerta,
            );
          } catch (error) {
            console.error(`Error al ${accion} novedad:`, error);
            this.alertasService.error(
              `Error al ${accion} la novedad. Intente de nuevo.`,
              5000,
              this.espacioConfigService.alertaEspacioConfigRef()!,
              this.estilosAlerta,
            );
          }
        }
        this.appService.setGuardando(false);
      });
  }

  public onToggleRow(row: Row<Novedad>, editing = false) {
    const rowId = row.id;
    const currentExpanded = this.tableState().expanded as Record<
      string,
      boolean
    >;

    let newExpanded: Record<string, boolean>;

    if (editing) {
      // Colapsar todas las demás filas y expandir solo esta
      newExpanded = { [rowId]: true };
    } else {
      // Toggle normal
      newExpanded = {
        ...currentExpanded,
        [rowId]: !currentExpanded[rowId],
      };
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  public onPageChange(estado: PaginationState): void {
    this.paginacion.set(estado);
  }

  private marcarTodosTouched() {
    this.fechaInicio.markAsTouched();
    this.fechaFin.markAsTouched();
    this.horaInicio.markAsTouched();
    this.horaFin.markAsTouched();
    this.descripcion.markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.fechaInicio.invalid ||
      this.fechaFin.invalid ||
      this.horaInicio.invalid ||
      this.horaFin.invalid ||
      this.descripcion.invalid
    );
  }

  private limpiarFormulario() {
    this.fechaInicio.reset('');
    this.fechaFin.reset('');
    this.horaInicio.reset('');
    this.horaFin.reset('');
    this.descripcion.reset('');

    // Limpiar valores de Pikaday
    if (this.pikadayInicio) {
      this.pikadayInicio.setDate(null);
      this.pikadayInicio.setStartRange(null);
      this.pikadayInicio.setEndRange(null);
      this.pikadayInicio.setMinDate(new Date());
      this.pikadayInicio.setMaxDate(null);
    }
    if (this.pikadayFin) {
      this.pikadayFin.setDate(null);
      this.pikadayFin.setStartRange(null);
      this.pikadayFin.setEndRange(null);
      this.pikadayFin.setMinDate(new Date());
      this.pikadayFin.setMaxDate(null);
    }
  }

  private finalizarOperacion() {
    this.novedadesService.setModoCreacion(false);
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    this.limpiarFormulario();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.novedadesService.resetAll();
    this.appService.setEditando(false);
    this.appService.setGuardando(false);
    this.limpiarFormulario();

    // Destruir instancias de Pikaday
    if (this.pikadayInicio) {
      this.pikadayInicio.destroy();
    }
    if (this.pikadayFin) {
      this.pikadayFin.destroy();
    }

    this.cdr.detectChanges();
  }
}
