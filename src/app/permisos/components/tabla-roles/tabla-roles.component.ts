import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  inject,
  input,
  computed,
  viewChild,
  TemplateRef,
  effect,
  Injector,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import {
  flexRenderComponent,
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  FlexRenderDirective,
  Row,
  ExpandedState,
  CellContext,
  PaginationState,
} from '@tanstack/angular-table';
import moment from 'moment';

import { Rol, Permiso } from '@permisos/interfaces';
import { PermisosService } from '@permisos/services/permisos.service';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { BotonAcciones } from '@shared/interfaces/boton-acciones.interface';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { AppService } from '@app/app.service';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { RolPermisos } from '../../interfaces/rol-permisos.interface';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ListaPermisosPantallaComponent } from '../lista-permisos-pantalla/lista-permisos-pantalla.component';
import { AlertasService } from '@shared/services/alertas.service';
import { AuthService } from '@auth/services/auth.service';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'tabla-roles',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResponsiveTableDirective,
    FlexRenderDirective,
    PaginadorComponent,
    WebIconComponent,
    ListaPermisosPantallaComponent,
  ],
  templateUrl: './tabla-roles.component.html',
  styleUrl: './tabla-roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'flex flex-col grow w-full overflow-hidden',
  },
})
export class TablaRolesComponent implements OnInit, OnDestroy {
  private injector = inject(Injector);
  private alertasService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private rolEnEdicion = signal<RolPermisos | null>(null);

  public permisosService = inject(PermisosService);
  public appService = inject(AppService);
  public authService = inject(AuthService);

  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));
  public nombre = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  public descripcion = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  public modoCreacion = computed(() => this.permisosService.modoCreacionRol());

  public alertaRoles = viewChild.required('alertaRoles', {
    read: ViewContainerRef,
  });

  public nombreCell = viewChild.required<TemplateRef<Util>>('nombreCell');
  public fechaCell = viewChild.required<TemplateRef<Util>>('fechaCell');
  public descripcionCell =
    viewChild.required<TemplateRef<Util>>('descripcionCell');

  public accionesNuevoRol = computed(() => [
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
      eventoClick: (event: Event) => this.onGuardarNuevoRol(),
    },
  ]);

  private columnasPorDefecto = signal<ColumnDef<RolPermisos>[]>([
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
      size: 100,
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: this.nombreCell,
    },
    {
      id: 'descripcion',
      accessorKey: 'descripcion',
      size: 150,
      header: 'Descripción',
      cell: this.descripcionCell,
    },
    {
      accessorKey: 'creadoEn',
      header: `Creado en`,
      accessorFn: row => {
        const date = moment(row.creadoEn);
        return date.isValid()
          ? date.format('DD/MM/YYYY HH:mm a')
          : 'Fecha inválida';
      },
      cell: this.fechaCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const rol = context.row.original;
        const id = rol.id;

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
                  eventoClick: (event: Event) => this.onGuardarNuevoRol(),
                },
              ],
            },
          });
        }

        // Para filas normales
        const enEdicion = this.permisosService.filaRolEditando()[id];
        const accionesVerificadas = [];

        if (this.authService.tienePermisos('PER000002')) {
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

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  readonly tablaRoles = createAngularTable(() => ({
    data: this.rolesQuery ?? [],
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
      pagination: this.permisosService.paginacionRoles(),
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
          ? estado(this.permisosService.paginacionRoles())
          : estado;

      this.permisosService.setPaginacionRoles({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
  }));

  ngOnInit() {
    effect(
      () => {
        this.permisosService.pestana();

        if (this.permisosService.pestana() !== 'rol') {
          this.nombre.reset();
          this.descripcion.reset();
          this.permisosService.setPermisosNuevoRol([]);
          this.permisosService.setPantallaSeleccionada(null);
          this.rolEnEdicion.set(null);
          this.permisosService.resetAllexceptPaginacion();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  get rolesQuery() {
    const roles = this.permisosService.rolesPermisosQuery.data() || [];

    if (this.modoCreacion()) {
      const rolVacio: RolPermisos = {
        id: -1, // ID negativo para identificar la fila de creación, igual que categorías
        nombre: '',
        descripcion: '',
        activo: null,
        creadoEn: this.fechaActual(),
        actualizadoEn: null,
        permisos: [],
      };
      return [rolVacio, ...roles];
    }
    return roles;
  }

  get pantallas() {
    return (
      this.appService.pantallasQuery
        .data()
        ?.filter(pantalla => pantalla.visible)
        ?.sort((a, b) => a.orden - b.orden) ?? []
    );
  }

  public onPageChange(estado: PaginationState): void {
    this.permisosService.setPaginacionRoles(estado);
  }

  public crearRol() {
    this.permisosService.setModoCreacionRol(true);
    this.appService.setEditando(true);
    this.permisosService.setEditandoFilaRol(0, true);
    this.rolEnEdicion.set(null);

    // Limpiar todos los controles de formulario
    this.nombre.reset('');
    this.descripcion.reset('');
    this.permisosService.setPermisosNuevoRol([]);
    this.permisosService.setPantallaSeleccionada(null);

    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.permisosService.setModoCreacionRol(false);
    this.appService.setEditando(false);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    this.nombre.reset();
    this.descripcion.reset();
    this.permisosService.setPermisosNuevoRol([]);
    this.permisosService.setPantallaSeleccionada(null);

    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  public onCancelarEdicion(row: Row<RolPermisos>) {
    const id = row.original.id;
    this.permisosService.setEditandoFilaRol(id, false);
    this.appService.setEditando(false);

    this.permisosService.limpiarPermisosSeleccionados(id);
    this.rolEnEdicion.set(null);

    // Colapsar todas las filas expandidas
    this.tableState.update(state => ({
      ...state,
      expanded: {},
    }));

    this.nombre.reset();
    this.descripcion.reset();
    this.permisosService.setPantallaSeleccionada(null);

    this.cdr.detectChanges();
  }

  private iniciarEdicion(row: Row<RolPermisos>) {
    const rol = row.original;
    const id = rol.id;

    this.permisosService.setEditandoFilaRol(id, true);
    this.rolEnEdicion.set(rol);
    this.appService.setEditando(true);

    // Expandir la fila automáticamente al iniciar edición
    this.onToggleRow(row, true);

    setTimeout(() => {
      this.nombre.setValue(rol.nombre);
      this.descripcion.setValue(rol.descripcion);

      this.nombre.markAsPristine();
      this.descripcion.markAsPristine();

      // Seleccionar primera pantalla si no hay ninguna seleccionada
      if (
        !this.permisosService.pantallaSeleccionada() &&
        this.pantallas.length > 0
      ) {
        this.permisosService.setPantallaSeleccionada(this.pantallas[0]);
      }

      this.cdr.detectChanges();
    }, 0);
    this.permisosService.setPermisosSeleccionados(id, rol.permisos);
  }

  private async onGuardarEdicion(row: Row<RolPermisos>) {
    this.nombre.markAsTouched();
    this.descripcion.markAsTouched();

    if (this.nombre.invalid || this.descripcion.invalid) {
      this.alertasService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    this.appService.setGuardando(true);
    const rol = row.original;
    const permisosSeleccionados = this.permisosService.getPermisosSeleccionados(
      rol.id,
    );

    const rolActualizado = {
      nombre: this.nombre.value!,
      descripcion: this.descripcion.value!,
      permisos: permisosSeleccionados,
    };

    try {
      await this.permisosService.actualizarRolAsync(rol.id, rolActualizado);

      this.alertasService.success(
        'Rol actualizado exitosamente.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Colapsar todas las filas expandidas
      this.tableState.update(state => ({
        ...state,
        expanded: {},
      }));

      this.permisosService.setEditandoFilaRol(rol.id, false);
      this.appService.setEditando(false);

      this.rolEnEdicion.set(null);
      this.nombre.reset();
      this.descripcion.reset();
      this.permisosService.limpiarPermisosSeleccionados(rol.id);
      this.permisosService.setPantallaSeleccionada(null);

      // Forzar detección de cambios
      this.cdr.detectChanges();

      this.permisosService.rolesPermisosQuery.refetch();
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      this.alertasService.error(
        `Error al actualizar el rol. ${
          (error as HttpErrorResponse).error.message
        }.`,
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      this.appService.setGuardando(false);
    }
  }

  public async onGuardarNuevoRol() {
    this.nombre.markAsTouched();
    this.descripcion.markAsTouched();

    if (this.nombre.invalid || this.descripcion.invalid) {
      this.alertasService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    this.appService.setGuardando(true);
    const permisosSeleccionados = this.permisosService.permisosNuevoRol();

    const nuevoRol = {
      nombre: this.nombre.value!,
      descripcion: this.descripcion.value!,
      permisos: permisosSeleccionados,
    };

    try {
      await this.permisosService.crearRolAsync(nuevoRol);

      this.alertasService.success(
        'Rol creado exitosamente.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Colapsar todas las filas expandidas
      this.tableState.update(state => ({
        ...state,
        expanded: {},
      }));

      this.cancelarCreacion();

      // Forzar detección de cambios antes del refetch
      this.cdr.detectChanges();

      this.permisosService.rolesPermisosQuery.refetch();
    } catch (error) {
      console.error('Error al crear rol:', error);
      this.alertasService.error(
        `Error al crear el rol. ${(error as HttpErrorResponse).error.message}.`,
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      this.appService.setGuardando(false);
    }
  }

  public onToggleRow(row: Row<RolPermisos>, editing = false) {
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
        this.permisosService.setPantallaSeleccionada(null);
      }
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));

    // Si es la fila de creación y se está expandiendo, seleccionar automáticamente la primera pantalla
    if (
      row.original.id === -1 &&
      newExpanded[rowId] &&
      this.pantallas.length > 0
    ) {
      setTimeout(() => {
        if (!this.permisosService.pantallaSeleccionada()) {
          this.permisosService.setPantallaSeleccionada(this.pantallas[0]);
        }
      }, 100);
    }
  }

  public obtenerPermisos(row: RolPermisos): Permiso[] {
    const pantallaSeleccionada = this.permisosService.pantallaSeleccionada();
    if (!pantallaSeleccionada) return [];

    const rolId = row.id;

    // Caso especial para la fila de creación
    if (rolId === -1) {
      const permisosDisponibles =
        this.pantallas.find(
          pant => pant.id_pantalla === pantallaSeleccionada.id_pantalla,
        )?.permisos || [];

      const permisosSeleccionados = this.permisosService.permisosNuevoRol();

      return permisosDisponibles
        .filter(
          permiso => permiso.id_pantalla === pantallaSeleccionada.id_pantalla,
        )
        .map(permiso => ({
          ...permiso,
          concedido: permisosSeleccionados.some(
            p => p.id_permiso === permiso.id_permiso && p.concedido,
          ),
        }));
    }

    const enEdicion = this.permisosService.filaRolEditando()[rolId];

    if (enEdicion) {
      const permisosDisponibles =
        this.pantallas.find(
          pant => pant.id_pantalla === pantallaSeleccionada.id_pantalla,
        )?.permisos || [];

      const permisosSeleccionados =
        this.permisosService.getPermisosSeleccionados(rolId);

      return permisosDisponibles
        .filter(
          permiso => permiso.id_pantalla === pantallaSeleccionada.id_pantalla,
        )
        .map(permiso => ({
          ...permiso,
          concedido: permisosSeleccionados.some(
            p => p.id_permiso === permiso.id_permiso && p.concedido,
          ),
        }));
    } else {
      return row.permisos.filter(
        permiso => permiso.id_pantalla === pantallaSeleccionada.id_pantalla,
      );
    }
  }

  public onPermisoToggle(
    evento: { permiso: Permiso; activo: boolean },
    rolId: number,
  ) {
    if (this.modoCreacion()) {
      const permisosActuales = this.permisosService.permisosNuevoRol();
      let nuevosPermisos: Permiso[];

      if (evento.activo) {
        if (
          !permisosActuales.find(
            p => p.id_permiso === evento.permiso.id_permiso,
          )
        ) {
          nuevosPermisos = [
            ...permisosActuales,
            { ...evento.permiso, concedido: true },
          ];
        } else {
          nuevosPermisos = permisosActuales.map(p =>
            p.id_permiso === evento.permiso.id_permiso
              ? { ...p, concedido: true }
              : p,
          );
        }
      } else {
        nuevosPermisos = permisosActuales
          .map(p =>
            p.id_permiso === evento.permiso.id_permiso
              ? { ...p, concedido: false }
              : p,
          )
          .filter(p => p.concedido);
      }

      this.permisosService.setPermisosNuevoRol(nuevosPermisos);
    } else {
      const permisosActuales =
        this.permisosService.getPermisosSeleccionados(rolId);
      let nuevosPermisos: Permiso[];

      if (evento.activo) {
        if (
          !permisosActuales.find(
            p => p.id_permiso === evento.permiso.id_permiso,
          )
        ) {
          nuevosPermisos = [
            ...permisosActuales,
            { ...evento.permiso, concedido: true },
          ];
        } else {
          nuevosPermisos = permisosActuales.map(p =>
            p.id_permiso === evento.permiso.id_permiso
              ? { ...p, concedido: true }
              : p,
          );
        }
      } else {
        nuevosPermisos = permisosActuales
          .map(p =>
            p.id_permiso === evento.permiso.id_permiso
              ? { ...p, concedido: false }
              : p,
          )
          .filter(p => p.concedido);
      }

      this.permisosService.setPermisosSeleccionados(rolId, nuevosPermisos);
    }
  }

  ngOnDestroy() {
    this.permisosService.setModoCreacionRol(false);
    this.appService.setEditando(false);
    this.permisosService.setEditandoFilaRol(0, false);
    this.permisosService.resetPermisosSeleccionados();
    this.rolEnEdicion.set(null);
    this.appService.setGuardando(false);

    this.nombre.reset(null);
    this.descripcion.reset(null);
    this.permisosService.setPermisosNuevoRol([]);
    this.permisosService.setPantallaSeleccionada(null);

    this.cdr.detectChanges();
  }
}
