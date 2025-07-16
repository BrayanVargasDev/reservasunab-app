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
import moment from 'moment';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { ConfigService } from '@configuracion/services/config.service';
import { AlertasService } from '@shared/services/alertas.service';
import { Categoria, BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { UpperFirstPipe } from '@shared/pipes';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { effect } from '@angular/core';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'config-categorias',
  imports: [
    CommonModule,
    ResponsiveTableDirective,
    FlexRenderDirective,
    ReactiveFormsModule,
    UpperFirstPipe,
    PaginadorComponent,
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
})
export class CategoriasComponent implements OnDestroy {
  private injector = inject(Injector);
  private upperFirstPipe = inject(UpperFirstPipe);
  private alertaService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private categoriaEnEdicion = signal<Categoria | null>(null);

  public configService = inject(ConfigService);
  public appService = inject(AppService);
  public authService = inject(AuthService);

  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));
  public nombre = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(3),
  ]);
  public grupo = new FormControl<number | null>(null, [Validators.required]);
  public reservasEstudiante = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public reservasAdministrativo = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public reservasExterno = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);
  public reservasEgresado = new FormControl<number | null>(null, [
    Validators.min(0),
  ]);

  public modoCreacion = computed(() =>
    this.configService.modoCreacionCategoria(),
  );

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public nombreCell = viewChild.required<TemplateRef<Util>>('nombreCell');
  public grupoCell = viewChild.required<TemplateRef<Util>>('grupoCell');
  public fechaCell = viewChild.required<TemplateRef<Util>>('fechaCell');

  public accionesNuevo = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      eventoClick: (event: Event) => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      eventoClick: (event: Event) => this.onGuardarNuevo(),
    },
  ]);

  private columnasPorDefecto = signal<ColumnDef<Categoria>[]>([
    {
      id: 'expansor',
      header: '',
      size: 55,
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
      size: 200,
      cell: this.nombreCell,
    },
    {
      id: 'grupo',
      accessorKey: 'grupo.nombre',
      size: 150,
      header: 'Grupo',
      cell: this.grupoCell,
    },
    {
      accessorKey: 'creado_en',
      header: `Creado en`,
      size: 200,
      accessorFn: row => {
        const date = moment(row.creado_en);
        return date.isValid()
          ? date.format('DD/MM/YYYY hh:mm a')
          : 'Fecha inválida';
      },
      cell: this.fechaCell,
    },
    {
      id: 'estado',
      accessorKey: 'eliminado_en',
      header: 'Estado',
      cell: this.estadoCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const categoria = context.row.original;
        const id = categoria.id;

        // Si es la fila de creación (ID = -1)
        if (id === -1) {
          return flexRenderComponent(AccionesTablaComponent, {
            inputs: {
              acciones: [
                {
                  tooltip: 'Cancelar',
                  icono: 'remove-circle-outline',
                  color: 'error',
                  eventoClick: (event: Event) => this.cancelarCreacion(),
                },
                {
                  tooltip: 'Guardar',
                  icono: 'save-outline',
                  color: 'success',
                  eventoClick: (event: Event) => this.onGuardarNuevo(),
                },
              ],
            },
          });
        }

        // Para filas normales
        const enEdicion = this.configService.filaCategoriaEditando()[id];
        const accionesVerificadas = [];

        if (this.authService.tienePermisos('ESP000011')) {
          accionesVerificadas.push({
            tooltip: 'Editar',
            icono: 'pencil-outline',
            color: 'accent',
            disabled: this.appService.editando(),
            eventoClick: (event: Event) => this.iniciarEdicion(context.row),
          });
        }

        const acciones: BotonAcciones[] = enEdicion
          ? [
              {
                tooltip: 'Cancelar',
                icono: 'remove-circle-outline',
                color: 'error',
                eventoClick: (event: Event) =>
                  this.onCancelarEdicion(context.row),
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
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

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  readonly tablaCategorias = createAngularTable(() => ({
    data: this.categoriasQuery ?? [],
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
      pagination: this.configService.paginacionCategorias(),
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
          ? estado(this.configService.paginacionCategorias())
          : estado;

      this.configService.setPaginacionCategorias({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
  }));

  ngOnInit() {
    effect(
      () => {
        this.configService.pestana();

        if (this.configService.pestana() !== 'categorias') {
          this.nombre.reset(null);
          this.grupo.reset(null);
          this.reservasEstudiante.reset(null);
          this.reservasAdministrativo.reset(null);
          this.reservasExterno.reset(null);
          this.reservasEgresado.reset(null);
          this.categoriaEnEdicion.set(null);
          this.configService.resetAll();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  get categoriasQuery() {
    const categorias = this.configService.categoriasQuery.data() || [];

    if (this.modoCreacion()) {
      const categoriaVacia: Categoria = {
        id: -1, // ID negativo para identificar la fila de creación
        nombre: '',
        id_grupo: undefined,
        reservas_estudiante: undefined,
        reservas_administrativo: undefined,
        reservas_externo: undefined,
        reservas_egresado: undefined,
        creado_en: this.fechaActual(),
        eliminado_en: null,
        creado_por: this.authService.usuario()!.id,
        actualizado_en: '',
        actualizado_por: null,
        eliminado_por: null,
        grupo: undefined, // Agregar el grupo como undefined para evitar errores
      };
      return [categoriaVacia, ...categorias];
    }
    return categorias;
  }

  public onPageChange(estado: PaginationState): void {
    this.configService.setPaginacionCategorias(estado);
  }

  public esColumnaEditable(columnId: string): boolean {
    const columnasEditables = [
      'nombre',
      'grupo',
      'reservas_estudiante',
      'reservas_administrativo',
      'reservas_externo',
      'reservas_egresado',
    ];
    return columnasEditables.includes(columnId);
  }

  public cambiarEstadoConfig(categoria: Categoria) {
    const nuevoEstado = categoria.eliminado_en === null ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} a la categoría para <strong>${categoria.nombre}</strong>?`,
        this.configService.alertaConfig()!,
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} categoria`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.configService
            .cambiarEstadoCategoria(categoria.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Categoría ${
                  accion === 'activar' ? 'activada' : 'desactivada'
                } exitosamente.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.configService.categoriasQuery.refetch();
              this.appService.categoriasQuery.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el categoría:`, error);
              this.alertaService.error(
                `Error al ${accion} el categoría. Por favor, inténtalo de nuevo.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  public crearCategoria() {
    this.configService.setModoCreacionCategoria(true);
    this.appService.setEditando(true);
    this.categoriaEnEdicion.set(null);

    // Limpiar todos los controles de formulario
    this.nombre.reset('');
    this.grupo.reset(null);
    this.reservasEstudiante.reset(null);
    this.reservasAdministrativo.reset(null);
    this.reservasExterno.reset(null);
    this.reservasEgresado.reset(null);

    this.cdr.detectChanges();
  }

  private iniciarEdicion(row: Row<Categoria>) {
    const tipoUsuarioConfig = row.original;
    const id = tipoUsuarioConfig.id;

    this.configService.setEditandoFilaCategoria(id, true);
    this.categoriaEnEdicion.set(tipoUsuarioConfig);
    this.appService.setEditando(true);

    setTimeout(() => {
      this.nombre.setValue(tipoUsuarioConfig.nombre);
      this.grupo.setValue(tipoUsuarioConfig.id_grupo ?? null);
      this.reservasEstudiante.setValue(
        tipoUsuarioConfig.reservas_estudiante ?? null,
      );
      this.reservasAdministrativo.setValue(
        tipoUsuarioConfig.reservas_administrativo ?? null,
      );
      this.reservasExterno.setValue(tipoUsuarioConfig.reservas_externo ?? null);
      this.reservasEgresado.setValue(
        tipoUsuarioConfig.reservas_egresado ?? null,
      );

      this.nombre.markAsPristine();
      this.grupo.markAsPristine();
      this.reservasEstudiante.markAsPristine();
      this.reservasAdministrativo.markAsPristine();
      this.reservasExterno.markAsPristine();
      this.reservasEgresado.markAsPristine();

      this.cdr.detectChanges();
    }, 0);
  }

  public onCancelarEdicion(row: Row<Categoria>) {
    const id = row.original.id;
    this.configService.setEditandoFilaCategoria(id, false);
    this.appService.setEditando(false);

    this.categoriaEnEdicion.set(null);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.grupo.reset(null);
    this.reservasEstudiante.reset(null);
    this.reservasAdministrativo.reset(null);
    this.reservasExterno.reset(null);
    this.reservasEgresado.reset(null);

    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.configService.setModoCreacionCategoria(false);
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.grupo.reset(null);
    this.reservasEstudiante.reset(null);
    this.reservasAdministrativo.reset(null);
    this.reservasExterno.reset(null);
    this.reservasEgresado.reset(null);

    this.cdr.detectChanges();
  }

  public async onGuardarNuevo() {
    this.nombre.markAsTouched();
    this.grupo.markAsTouched();

    if (this.nombre.invalid || this.grupo.invalid) {
      this.alertaService.error(
        'Todos los campos son requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    const nuevaCategoria: Partial<Categoria> = {
      nombre: this.nombre.value?.trim(),
      id_grupo: this.grupo.value ?? 0,
      reservas_estudiante: this.reservasEstudiante.value ?? undefined,
      reservas_administrativo: this.reservasAdministrativo.value ?? undefined,
      reservas_externo: this.reservasExterno.value ?? undefined,
      reservas_egresado: this.reservasEgresado.value ?? undefined,
    };

    try {
      await this.configService.crearCategoria(nuevaCategoria);

      this.alertaService.success(
        'Categoria creada exitosamente.',
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
      this.configService.categoriasQuery.refetch();
      this.appService.categoriasQuery.refetch();
    } catch (error) {
      console.error('Error al crear categoría:', error);
      this.alertaService.error(
        'Error al crear el categoría. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  private async onGuardarEdicion(row: Row<Categoria>) {
    this.nombre.markAsTouched();
    this.grupo.markAsTouched();

    if (this.nombre.invalid || this.grupo.invalid) {
      this.alertaService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    const categoria = row.original;

    const configActualizada: Categoria = {
      ...categoria,
      nombre: this.nombre.value!,
      id_grupo: this.grupo.value!,
      reservas_estudiante: this.reservasEstudiante.value ?? undefined,
      reservas_administrativo: this.reservasAdministrativo.value ?? undefined,
      reservas_externo: this.reservasExterno.value ?? undefined,
      reservas_egresado: this.reservasEgresado.value ?? undefined,
    };

    try {
      await this.configService.actualizarCategoria(
        categoria.id,
        configActualizada,
      );

      this.alertaService.success(
        'Categoría actualizada exitosamente.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Colapsar todas las filas expandidas
      this.tableState.update(state => ({
        ...state,
        expanded: {},
      }));

      this.configService.setEditandoFilaCategoria(categoria.id, false);
      this.appService.setEditando(false);
      this.categoriaEnEdicion.set(null);

      // Limpiar todos los controles de formulario
      this.nombre.reset(null);
      this.grupo.reset(null);
      this.reservasEstudiante.reset(null);
      this.reservasAdministrativo.reset(null);
      this.reservasExterno.reset(null);
      this.reservasEgresado.reset(null);

      this.configService.categoriasQuery.refetch();
      this.appService.categoriasQuery.refetch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      this.alertaService.error(
        'Error al actualizar la categoría. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  public onToggleRow(row: Row<Categoria>, editing = false) {
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
        this.configService.setCategoriaeleccionada(null);
      }
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  ngOnDestroy() {
    this.configService.setModoCreacionCategoria(false);
    this.appService.setEditando(false);
    this.configService.setEditandoFilaCategoria(0, false);
    this.categoriaEnEdicion.set(null);

    // Limpiar todos los controles de formulario
    this.nombre.reset(null);
    this.grupo.reset(null);
    this.reservasEstudiante.reset(null);
    this.reservasAdministrativo.reset(null);
    this.reservasExterno.reset(null);
    this.reservasEgresado.reset(null);

    this.cdr.detectChanges();
  }
}
