import {
  Component,
  ChangeDetectionStrategy,
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
import { WebIconComponent } from '../../../shared/components/web-icon/web-icon.component';
import { ListaPermisosPantallaComponent } from '../lista-permisos-pantalla/lista-permisos-pantalla.component';
import { PaginationState } from '@tanstack/angular-table';
import { AlertasService } from '@shared/services/alertas.service';

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
    AccionesTablaComponent,
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
export class TablaRolesComponent implements OnDestroy, OnInit {
  private injector = inject(Injector);
  private alertasService = inject(AlertasService);
  public permisosService = inject(PermisosService);

  public modoCreacion = input<boolean>(false);

  public nombre = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  public descripcion = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  private rolEnEdicion = signal<RolPermisos | null>(null);

  public alertaRoles = viewChild.required('alertaRoles', {
    read: ViewContainerRef,
  });

  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));

  public accionesNuevoRol = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      eventoClick: (event: Event) => {
        this.cancelarCreacion();
      },
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      eventoClick: (event: Event) => this.onGuardarNuevoRol(),
    },
  ]);

  columnasPorDefecto = signal<ColumnDef<RolPermisos>[]>([
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
    },
    {
      id: 'descripcion',
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: info => info.getValue(),
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
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const id = context.row.original.id;
        const enEdicion = this.permisosService.filaPermisosEditando()[id];

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
          : [
              {
                tooltip: 'Editar',
                icono: 'pencil-outline',
                color: 'accent',
                disabled:
                  this.appService.editando() ||
                  this.permisosService.modoCreacion(),
                eventoClick: (event: Event) => this.iniciarEdicion(context.row),
              },
            ];

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            acciones,
          },
        });
      },
    },
  ]);

  ngOnInit() {
    effect(
      () => {
        this.permisosService.pestana();
        this.permisosService.paginacionRoles();
        this.tableState.update(state => ({
          ...state,
          expanded: {},
        }));
        this.permisosService.resetAllexceptPaginacion();
      },
      {
        injector: this.injector,
      },
    );
  }

  public appService = inject(AppService);
  public celdaAcciones = viewChild.required<TemplateRef<Util>>('celdaAcciones');

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  readonly tablaRoles = createAngularTable(() => ({
    data: this.rolesQuery.data() ?? [],
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
      pagination: this.permisosService.paginacionRoles(),
      expanded: this.tableState().expanded,
      globalFilter: this.tableState().globalFilter,
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

  get rolesQuery() {
    return this.permisosService.rolesPermisosQuery;
  }

  get pantallas() {
    return (
      this.appService.pantallasQuery
        .data()
        ?.sort((a, b) => a.orden - b.orden) ?? []
    );
  }

  private cancelarCreacion() {
    this.permisosService.setModoCreacion(false);
    this.appService.setEditando(false);
    this.nombre.reset();
    this.descripcion.reset();
    this.permisosService.setPermisosNuevoRol([]);
    this.permisosService.setPantallaSeleccionada(null);
  }

  public onCancelarEdicion(row: Row<RolPermisos>) {
    const id = row.original.id;
    this.permisosService.setEditandoFilaPermisos(id, false);
    this.onToggleRow(row);
    this.permisosService.setModoCreacion(false);
    this.appService.setEditando(false);

    this.permisosService.limpiarPermisosSeleccionados(id);
    this.rolEnEdicion.set(null);
    this.nombre.reset();
    this.descripcion.reset();
  }

  private iniciarEdicion(row: Row<RolPermisos>) {
    const rol = row.original;
    const id = rol.id;

    this.permisosService.setEditandoFilaPermisos(id, true);
    this.rolEnEdicion.set(rol);
    this.appService.setEditando(true);

    this.nombre.setValue(rol.nombre);
    this.descripcion.setValue(rol.descripcion);

    this.permisosService.setPermisosSeleccionados(id, rol.permisos);

    this.onToggleRow(row, true);
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

      this.permisosService.setEditandoFilaPermisos(rol.id, false);
      this.onToggleRow(row);
      this.appService.setEditando(false);
      this.rolEnEdicion.set(null);
      this.nombre.reset();
      this.descripcion.reset();
      this.permisosService.limpiarPermisosSeleccionados(rol.id);

      this.rolesQuery.refetch();
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      this.alertasService.error(
        'Error al actualizar el rol. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
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

      this.cancelarCreacion();
      this.rolesQuery.refetch();
    } catch (error) {
      console.error('Error al crear rol:', error);
      this.alertasService.error(
        'Error al crear el rol. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaRoles(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
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
  }

  public obtenerPermisos(row: RolPermisos): Permiso[] {
    const pantallaSeleccionada = this.permisosService.pantallaSeleccionada();
    if (!pantallaSeleccionada) return [];

    const rolId = row.id;
    const enEdicion = this.permisosService.filaPermisosEditando()[rolId];

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

  public obtenerPermisosNuevoRol(): Permiso[] {
    const pantallaSeleccionada = this.permisosService.pantallaSeleccionada();
    if (!pantallaSeleccionada) return [];

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

  public onPermisosChange(permisos: Permiso[], rolId: number) {
    if (this.permisosService.modoCreacion()) {
      this.permisosService.setPermisosNuevoRol(permisos);
    } else {
      this.permisosService.setPermisosSeleccionados(rolId, permisos);
    }
  }

  public onPermisoToggle(
    evento: { permiso: Permiso; activo: boolean },
    rolId: number,
  ) {
    if (this.permisosService.modoCreacion()) {
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

  onPageChange(estado: PaginationState): void {
    this.permisosService.setPaginacion(estado);
  }

  ngOnDestroy() {
    this.permisosService.setModoCreacion(false);
    this.appService.setEditando(false);
    this.permisosService.resetPermisosSeleccionados();
  }
}
