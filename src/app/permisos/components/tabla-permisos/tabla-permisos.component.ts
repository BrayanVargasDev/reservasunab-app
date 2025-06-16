import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  viewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
  effect,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

import {
  ColumnDef,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  FlexRenderDirective,
  flexRenderComponent,
  CellContext,
  ExpandedState,
} from '@tanstack/angular-table';
import moment from 'moment';

import { AppService } from '@app/app.service';
import { Permiso } from '@permisos/interfaces/permiso.interface';
import { PermisosService } from '@permisos/services/permisos.service';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { type BotonAcciones } from '@shared/interfaces/boton-acciones.interface';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { computed } from '@angular/core';
import { PermisosUsuario } from '@permisos/interfaces/permisos-usuario.interface';
import { Pantalla } from '@shared/interfaces/pantalla.interface';
import { ListaPermisosPantallaComponent } from '../lista-permisos-pantalla/lista-permisos-pantalla.component';
import { Row, PaginationState } from '@tanstack/angular-table';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { AlertasService } from '@shared/services/alertas.service';
import { UsuariosService } from '@usuarios/services/usuarios.service';
import { Usuario } from '@usuarios/intefaces';
import { Rol } from '@permisos/interfaces';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'tabla-permisos',
  imports: [
    CommonModule,
    FlexRenderDirective,
    TableExpansorComponent,
    ResponsiveTableDirective,
    WebIconComponent,
    ListaPermisosPantallaComponent,
    PaginadorComponent,
  ],
  templateUrl: './tabla-permisos.component.html',
  styleUrl: './tabla-permisos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TablaPermisosComponent implements OnDestroy, OnInit {
  private injector = inject(Injector);
  private alertaService = inject(AlertasService);
  public usuariosService = inject(UsuariosService);
  public permisosService = inject(PermisosService);

  private columnasPorDefecto = signal<ColumnDef<PermisosUsuario>[]>([
    {
      id: 'expansor',
      header: () => '',
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
      id: 'documento',
      accessorKey: 'documento',
      header: 'Documento',
      cell: info => `<span class="font-bold">${info.getValue()}</span>`,
    },
    {
      id: 'nombre',
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: info => info.getValue(),
    },
    {
      id: 'rol',
      header: 'Rol',
      accessorKey: 'rol',
      cell: () => this.celdaRol(),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const id = context.row.original.id_usuario;
        const enEdicion = this.permisosService.filaPermisosEditando()[id];

        const acciones: BotonAcciones[] = enEdicion
          ? [
              {
                tooltip: 'Cancelar',
                icono: 'remove-circle-outline',
                color: 'error',
                eventoClick: () => {
                  this.permisosService.setEditandoFilaPermisos(id, false);
                  this.onToggleRow(context.row);
                  this.permisosService.setModoCreacion(false);
                  this.appService.setEditando(false);
                },
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
                eventoClick: () => {
                  this.permisosService.setEditandoFilaPermisos(id, false);
                  this.onToggleRow(context.row);
                },
              },
            ]
          : [
              {
                tooltip: 'Editar',
                icono: 'pencil-outline',
                color: 'accent',
                eventoClick: () => {
                  this.permisosService.setEditandoFilaPermisos(id, true);
                  this.onToggleRow(context.row, true);
                  this.permisosService.setModoCreacion(false);
                  this.appService.setEditando(true);
                },
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

  public alertaPermisos = viewChild.required('alertaPermisos', {
    read: ViewContainerRef,
  });

  ngOnInit() {
    effect(
      () => {
        this.permisosService.botonArenderizar();
        this.tableState.update(state => ({
          ...state,
          expanded: {},
        }));
        this.permisosService.setPantallaSeleccionada(null);
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

  public tablaPermisos = createAngularTable(() => ({
    data: this.permisosQuery.data() ?? [],
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
      pagination: this.permisosService.paginacion(),
      expanded: this.tableState().expanded,
      globalFilter: this.tableState().globalFilter,
    },
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.permisosService.paginacion())
          : estado;

      this.permisosService.setPaginacion({
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

  public celdaRol =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'celdaRol',
    );

  get permisosQuery() {
    return this.permisosService.permisosQuery;
  }

  get rolesQuery() {
    return this.appService.rolesQuery.data();
  }

  get pantallas() {
    return (
      this.appService.pantallasQuery
        .data()
        ?.sort((a, b) => a.orden - b.orden) ?? []
    );
  }

  ngOnDestroy() {
    this.permisosService.setModoCreacion(false);
    this.appService.setEditando(false);
  }

  public onToggleRow(row: Row<PermisosUsuario>, editing = false) {
    console.log('Toggling row:', row);
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
      this.permisosService.setPantallaSeleccionada(null);
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  public obtenerPermisos(row: PermisosUsuario): Permiso[] {
    return row.permisos.filter(
      permiso =>
        permiso.id_pantalla ===
        this.permisosService.pantallaSeleccionada()?.id_pantalla,
    );
  }

  onPageChange(estado: PaginationState): void {
    this.permisosService.setPaginacion(estado);
  }

  // Método para manejar el toggle de permisos
  public onPermisoToggle(evento: { permiso: Permiso; activo: boolean }): void {
    console.log('Permiso toggle:', evento);
    // Aquí puedes implementar la lógica para actualizar los permisos del usuario
    // Por ejemplo, hacer una llamada al servicio para guardar los cambios
  }

  cambiarRolUsuario(usuario: PermisosUsuario, nuevoRol: Rol) {
    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres cambiar el rol de <strong>${usuario.nombre}</strong> a <strong>${nuevoRol.nombre}</strong>?`,
        this.alertaPermisos(),
        'Cambiar rol de usuario',
        'info',
      )
      .then(confirmado => {
        if (confirmado) {
          this.usuariosService
            .cambiarRolUsuario(usuario.id_usuario, nuevoRol.id || 0)
            .then(() => {
              this.alertaService.success(
                'Rol de usuario actualizado exitosamente.',
                5000,
                this.alertaPermisos(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.permisosService.permisosQuery.refetch();
            })
            .catch((error: any) => {
              console.error('Error al cambiar el rol del usuario:', error);
              this.alertaService.error(
                'Error al cambiar el rol del usuario. Por favor, inténtalo de nuevo.',
                5000,
                this.alertaPermisos(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }
}
