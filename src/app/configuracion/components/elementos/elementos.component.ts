import {
  Component,
  inject,
  computed,
  signal,
  viewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnDestroy,
  Injector,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import {
  flexRenderComponent,
  ColumnDef,
  CellContext,
  Row,
  ExpandedState,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  FlexRenderDirective,
  PaginationState,
} from '@tanstack/angular-table';
import { format } from 'date-fns';
import { formatInBogota } from '@shared/utils/timezone';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { ConfigService } from '@configuracion/services/config.service';
import { AlertasService } from '@shared/services/alertas.service';
import { Elemento, BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { UpperFirstPipe } from '@shared/pipes';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'config-elementos',
  imports: [
    CommonModule,
    ResponsiveTableDirective,
    FlexRenderDirective,
    ReactiveFormsModule,
    UpperFirstPipe,
    PaginadorComponent,
  ],
  templateUrl: './elementos.component.html',
  styleUrl: './elementos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ElementosComponent {
  private injector = inject(Injector);
  private upperFirstPipe = inject(UpperFirstPipe);
  private alertaService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private elementoEnEdicion = signal<Elemento | null>(null);

  public configService = inject(ConfigService);
  public appService = inject(AppService);
  public authService = inject(AuthService);

  public fechaActual = computed(() =>
    formatInBogota(new Date(), 'dd/MM/yyyy HH:mm a'),
  );
  public nombre = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(3),
  ]);
  public cantidad = new FormControl<number | null>(null, [Validators.required]);
  public espacio = new FormControl<number | null>(null, [Validators.required]);
  public valorEstudiante = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public valorAdministrativo = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public valorExterno = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public valorEgresado = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);

  public modoCreacion = computed(() =>
    this.configService.modoCreacionElemento(),
  );

  public obtenerEspacioSelect(id: number): string {
    const espacio = this.appService.espaciosQuery
      .data()
      ?.find(e => e.id === id);
    return espacio ? espacio.nombre : 'Desconocido';
  }

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public nombreCell = viewChild.required<TemplateRef<Util>>('nombreCell');
  public espacioCell = viewChild.required<TemplateRef<Util>>('espacioCell');
  public fechaCell = viewChild.required<TemplateRef<Util>>('fechaCell');
  public cantidadCell = viewChild.required<TemplateRef<Util>>('cantidadCell');

  public accionesNuevo = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      disabled: this.appService.guardando(),
      eventoClick: (event: Event) => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      disabled: this.appService.guardando(),
      eventoClick: (event: Event) => this.onGuardarNuevo(),
    },
  ]);

  private columnasPorDefecto = signal<ColumnDef<Elemento>[]>([
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
      id: 'nombre',
      accessorKey: 'nombre',
      header: 'Nombre',
      size: 150,
      cell: this.nombreCell,
    },
    {
      id: 'espacio',
      accessorKey: 'espacio.nombre',
      size: 150,
      header: 'Espacio',
      cell: this.espacioCell,
    },
    {
      id: 'cantidad',
      accessorKey: 'cantidad',
      header: 'Cantidad',
      size: 150,
      cell: this.cantidadCell,
    },
    {
      accessorKey: 'creado_en',
      header: `Creado en`,
      size: 150,
      accessorFn: row => {
        const d = new Date(row.creado_en);
        return isNaN(d.getTime())
          ? 'Fecha inválida'
          : formatInBogota(d, 'dd/MM/yyyy hh:mm a');
      },
      cell: this.fechaCell,
    },
    {
      id: 'estado',
      accessorKey: 'eliminado_en',
      header: 'Estado',
      size: 400,
      cell: this.estadoCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const elemento = context.row.original;
        const id = elemento.id;

        // Si es la fila de creación (ID = -1)
        if (id === -1) {
          return flexRenderComponent(AccionesTablaComponent, {
            inputs: {
              visibles: context.column.getIsVisible(),
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
        const enEdicion = this.configService.filaElementoEditando()[id];
        const accionesVerificadas = [];

        if (this.authService.tienePermisos('ESP000011')) {
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
            visibles: context.column.getIsVisible(),
            acciones,
          },
        });
      },
    },
  ]);

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  readonly tablaElementos = createAngularTable(() => ({
    data: this.elementosQuery ?? [],
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    autoResetExpanded: false, // Mantener control manual de expansión
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    state: {
      expanded: this.tableState().expanded,
      pagination: this.configService.paginacionElementos(),
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
        typeof estado === 'function'
          ? estado(this.configService.paginacionElementos())
          : estado;

      this.configService.setPaginacionElementos({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
  }));

  ngOnInit() {
    effect(
      () => {
        this.configService.pestana();

        if (this.configService.pestana() !== 'elementos') {
          this.nombre.reset(null);
          this.espacio.reset(null);
          this.cantidad.reset(null);
          this.valorEstudiante.reset(null);
          this.valorAdministrativo.reset(null);
          this.valorExterno.reset(null);
          this.valorEgresado.reset(null);
          this.elementoEnEdicion.set(null);
          this.configService.resetAll();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  get elementosQuery() {
    const elementos = this.configService.elementosQuery.data() || [];

    if (this.modoCreacion()) {
      const elementoVacio: Elemento = {
        id: -1, // ID negativo para identificar la fila de creación
        nombre: '',
        cantidad: 0,
        id_espacio: -1,
        valor_estudiante: 0,
        valor_administrativo: 0,
        valor_externo: 0,
        valor_egresado: 0,
        creado_en: this.fechaActual(),
        eliminado_en: null,
        actualizado_en: null,
      };
      return [elementoVacio, ...elementos];
    }
    return elementos;
  }

  public onPageChange(estado: PaginationState): void {
    this.configService.setPaginacionElementos(estado);
  }

  public cambiarEstadoConfig(elemento: Elemento) {
    const nuevoEstado = elemento.eliminado_en === null ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.appService.setGuardando(true);
    this.cdr.detectChanges();

    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} el elemento <strong>${elemento.nombre}</strong>?`,
        this.configService.alertaConfig()!,
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} elemento`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.configService
            .cambiarEstadoElemento(elemento.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Elemento ${
                  accion === 'activar' ? 'activado' : 'desactivado'
                } exitosamente.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.configService.elementosQuery.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el elemento:`, error);
              this.alertaService.error(
                `Error al ${accion} el elemento. Por favor, inténtalo de nuevo.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            })
            .finally(() => {
              this.appService.setGuardando(false);
              this.cdr.detectChanges();
            });
        } else {
          this.appService.setGuardando(false);
          this.cdr.detectChanges();
        }
      });
  }

  public crearElemento() {
    this.configService.setModoCreacionElemento(true);
    this.appService.setEditando(true);
    this.elementoEnEdicion.set(null);

    // Limpiar todos los controles de formulario
    this.nombre.reset('');
    this.espacio.reset(null);
    this.cantidad.reset(null);
    this.valorEstudiante.reset(null);
    this.valorAdministrativo.reset(null);
    this.valorExterno.reset(null);
    this.valorEgresado.reset(null);

    this.cdr.detectChanges();
  }

  private iniciarEdicion(row: Row<Elemento>) {
    const elemento = row.original;
    const id = elemento.id;

    this.configService.setEditandoFilaElemento(id, true);
    this.elementoEnEdicion.set(elemento);
    this.appService.setEditando(true);

    setTimeout(() => {
      this.nombre.setValue(elemento.nombre);
      this.espacio.setValue(elemento.id_espacio ?? null);
      this.cantidad.setValue(elemento.cantidad ?? 0);
      this.valorEstudiante.setValue(elemento.valor_estudiante ?? null);
      this.valorAdministrativo.setValue(elemento.valor_administrativo ?? null);
      this.valorExterno.setValue(elemento.valor_externo ?? null);
      this.valorEgresado.setValue(elemento.valor_egresado ?? null);

      this.nombre.markAsPristine();
      this.espacio.markAsPristine();
      this.cantidad.markAsPristine();
      this.valorEstudiante.markAsPristine();
      this.valorAdministrativo.markAsPristine();
      this.valorExterno.markAsPristine();
      this.valorEgresado.markAsPristine();
      this.onToggleRow(row, true);
      this.cdr.detectChanges();
    }, 0);
  }

  public onCancelarEdicion(row: Row<Elemento>) {
    const id = row.original.id;
    this.configService.setEditandoFilaElemento(id, false);
    this.appService.setEditando(false);

    this.elementoEnEdicion.set(null);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.espacio.reset(null);
    this.cantidad.reset(null);
    this.valorEstudiante.reset(null);
    this.valorAdministrativo.reset(null);
    this.valorExterno.reset(null);
    this.valorEgresado.reset(null);

    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.configService.setModoCreacionElemento(false);
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.espacio.reset(null);
    this.cantidad.reset(null);
    this.valorEstudiante.reset(null);
    this.valorAdministrativo.reset(null);
    this.valorExterno.reset(null);
    this.valorEgresado.reset(null);

    this.cdr.detectChanges();
  }

  public async onGuardarNuevo() {
    this.nombre.markAsTouched();
    this.espacio.markAsTouched();

    if (this.nombre.invalid || this.espacio.invalid) {
      this.alertaService.error(
        'Todos los campos son requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    // Activar estado de guardado
    this.appService.setGuardando(true);

    const nuevoElemento: Partial<Elemento> = {
      nombre: this.nombre.value?.trim(),
      id_espacio: this.espacio.value ?? 0,
      cantidad: this.cantidad.value ?? 0,
      valor_estudiante: this.valorEstudiante.value ?? undefined,
      valor_administrativo: this.valorAdministrativo.value ?? undefined,
      valor_externo: this.valorExterno.value ?? undefined,
      valor_egresado: this.valorEgresado.value ?? undefined,
    };

    try {
      await this.configService.crearElemento(nuevoElemento);

      this.alertaService.success(
        'Elemento creada exitosamente.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Colapsar todas las filas expandidas
      this.tableState.update(state => ({
        ...state,
        expanded: {},
      }));

      this.cancelarCreacion();
      this.configService.elementosQuery.refetch();
    } catch (error) {
      console.error('Error al crear elemento:', error);
      this.alertaService.error(
        'Error al crear el elemento. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      // Desactivar estado de guardado
      this.appService.setGuardando(false);
    }
  }

  private async onGuardarEdicion(row: Row<Elemento>) {
    this.nombre.markAsTouched();
    this.espacio.markAsTouched();

    if (this.nombre.invalid || this.espacio.invalid) {
      this.alertaService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    // Activar estado de guardado
    this.appService.setGuardando(true);

    const elemento = row.original;

    const elementoActualizado: Elemento = {
      ...elemento,
      nombre: this.nombre.value!,
      cantidad: this.cantidad.value ?? 0,
      id_espacio: this.espacio.value!,
      valor_estudiante: this.valorEstudiante.value ?? 0,
      valor_administrativo: this.valorAdministrativo.value ?? 0,
      valor_externo: this.valorExterno.value ?? 0,
      valor_egresado: this.valorEgresado.value ?? 0,
    };

    try {
      await this.configService.actualizarElemento(
        elemento.id,
        elementoActualizado,
      );

      this.alertaService.success(
        'Elemento actualizado exitosamente.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Colapsar todas las filas expandidas
      this.tableState.update(state => ({
        ...state,
        expanded: {},
      }));

      this.configService.setEditandoFilaElemento(elemento.id, false);
      this.appService.setEditando(false);
      this.elementoEnEdicion.set(null);

      // Limpiar todos los controles de formulario
      this.nombre.reset(null);
      this.espacio.reset(null);
      this.cantidad.reset(null);
      this.valorEgresado.reset(null);
      this.valorAdministrativo.reset(null);
      this.valorExterno.reset(null);
      this.valorEgresado.reset(null);

      this.configService.elementosQuery.refetch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar la elemento:', error);
      this.alertaService.error(
        'Error al actualizar la elemento. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      // Desactivar estado de guardado
      this.appService.setGuardando(false);
    }
  }

  public onToggleRow(row: Row<Elemento>, editing = false) {
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
      if (currentExpanded[rowId]) {
        this.configService.setElementoSeleccionado(null);
      }
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  ngOnDestroy() {
    this.configService.setModoCreacionElemento(false);
    this.appService.setEditando(false);
    this.configService.setEditandoFilaElemento(0, false);
    this.elementoEnEdicion.set(null);
    this.appService.setGuardando(false);

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.espacio.reset(null);
    this.valorEgresado.reset(null);
    this.valorAdministrativo.reset(null);
    this.valorExterno.reset(null);
    this.valorEgresado.reset(null);

    this.cdr.detectChanges();
  }
}
