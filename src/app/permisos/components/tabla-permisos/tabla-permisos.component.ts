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
  computed,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

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
  Row,
  PaginationState,
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
import { PermisosUsuario } from '@permisos/interfaces/permisos-usuario.interface';
import { Pantalla } from '@shared/interfaces/pantalla.interface';
import { ListaPermisosPantallaComponent } from '../lista-permisos-pantalla/lista-permisos-pantalla.component';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { AlertasService } from '@shared/services/alertas.service';
import { UsuariosService } from '@usuarios/services/usuarios.service';
import { Usuario } from '@usuarios/intefaces';
import { Rol } from '@permisos/interfaces';
import { AuthService } from '@auth/services/auth.service';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'tabla-permisos',
  imports: [
    CommonModule,
    FlexRenderDirective,
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
  public authService = inject(AuthService);
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
                eventoClick: () => this.onCancelarEdicionUsuario(context.row),
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
                eventoClick: () => this.onGuardarEdicionUsuario(context.row),
              },
            ]
          : this.authService.tienePermisos('PER000003')
          ? [
              {
                tooltip: 'Editar',
                icono: 'pencil-outline',
                color: 'accent',
                disabled:
                  this.appService.editando() ||
                  this.permisosService.modoCreacion(),
                eventoClick: () => this.iniciarEdicionUsuario(context.row),
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

  public alertaPermisos = viewChild.required('alertaPermisos', {
    read: ViewContainerRef,
  });

  private usuarioEnEdicion = signal<PermisosUsuario | null>(null);

  ngOnInit() {
    effect(
      () => {
        this.permisosService.pestana();
        this.permisosService.paginacion();
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
    this.permisosService.resetPermisosSeleccionados();
  }

  public onToggleRow(row: Row<PermisosUsuario>, editing = false) {
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

  private iniciarEdicionUsuario(row: Row<PermisosUsuario>) {
    const usuario = row.original;
    const id = usuario.id_usuario;

    this.permisosService.setEditandoFilaPermisos(id, true);
    this.usuarioEnEdicion.set(usuario);
    this.appService.setEditando(true);

    this.permisosService.setPermisosUsuarioEditando(id, usuario.permisos);

    this.onToggleRow(row, true);
  }

  public onCancelarEdicionUsuario(row: Row<PermisosUsuario>) {
    const id = row.original.id_usuario;

    this.permisosService.setEditandoFilaPermisos(id, false);
    this.onToggleRow(row);
    this.permisosService.setModoCreacion(false);
    this.appService.setEditando(false);

    this.permisosService.limpiarPermisosUsuarioEditando(id);
    this.usuarioEnEdicion.set(null);
  }

  public async onGuardarEdicionUsuario(row: Row<PermisosUsuario>) {
    const usuario = row.original;
    const userId = usuario.id_usuario;
    const permisosSeleccionados =
      this.permisosService.getPermisosUsuarioEditando(userId);

    try {
      await this.permisosService.actualizarPermisosUsuarioAsync(
        userId,
        permisosSeleccionados,
      );

      this.alertaService.success(
        'Permisos de usuario actualizados exitosamente.',
        5000,
        this.alertaPermisos(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      // Limpiar estado de edición
      this.permisosService.setEditandoFilaPermisos(userId, false);
      this.onToggleRow(row);
      this.appService.setEditando(false);
      this.usuarioEnEdicion.set(null);
      this.permisosService.limpiarPermisosUsuarioEditando(userId);

      // Refetch data
      this.permisosQuery.refetch();
    } catch (error) {
      console.error('Error al actualizar permisos de usuario:', error);
      this.alertaService.error(
        `Error al actualizar los permisos del usuario. ${
          (error as HttpErrorResponse).error.message
        }.`,
        5000,
        this.alertaPermisos(),
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  public obtenerPermisos(row: PermisosUsuario): Permiso[] {
    const pantallaSeleccionada = this.permisosService.pantallaSeleccionada();
    if (!pantallaSeleccionada) return [];

    const userId = row.id_usuario;
    const enEdicion = this.permisosService.filaPermisosEditando()[userId];

    if (enEdicion) {
      const permisosDisponibles =
        this.pantallas.find(
          pant => pant.id_pantalla === pantallaSeleccionada.id_pantalla,
        )?.permisos || [];

      const permisosEnEdicion =
        this.permisosService.getPermisosUsuarioEditando(userId);

      return permisosDisponibles
        .filter(
          permiso => permiso.id_pantalla === pantallaSeleccionada.id_pantalla,
        )
        .map(permiso => ({
          ...permiso,
          concedido: permisosEnEdicion.some(
            p => p.id_permiso === permiso.id_permiso && p.concedido,
          ),
        }));
    } else {
      // En modo vista: usar permisos originales del usuario
      return row.permisos.filter(
        permiso => permiso.id_pantalla === pantallaSeleccionada.id_pantalla,
      );
    }
  }

  onPageChange(estado: PaginationState): void {
    this.permisosService.setPaginacion(estado);
  }

  /**
   * Maneja el toggle individual de permisos para usuarios
   * Reutiliza la lógica de persistencia implementada para roles
   */
  public onPermisoToggle(
    evento: { permiso: Permiso; activo: boolean },
    userId?: number,
  ): void {
    // Si no se proporciona userId, intentar obtenerlo del usuario en edición
    if (!userId && this.usuarioEnEdicion()) {
      userId = this.usuarioEnEdicion()!.id_usuario;
    }

    if (!userId) {
      console.warn(
        'No se pudo determinar el ID del usuario para el toggle de permiso',
      );
      return;
    }

    const permisosActuales =
      this.permisosService.getPermisosUsuarioEditando(userId);
    let nuevosPermisos: Permiso[];

    if (evento.activo) {
      // Agregar permiso si no existe
      if (
        !permisosActuales.find(p => p.id_permiso === evento.permiso.id_permiso)
      ) {
        nuevosPermisos = [
          ...permisosActuales,
          { ...evento.permiso, concedido: true },
        ];
      } else {
        // Actualizar permiso existente
        nuevosPermisos = permisosActuales.map(p =>
          p.id_permiso === evento.permiso.id_permiso
            ? { ...p, concedido: true }
            : p,
        );
      }
    } else {
      // Remover o marcar como no concedido
      nuevosPermisos = permisosActuales
        .map(p =>
          p.id_permiso === evento.permiso.id_permiso
            ? { ...p, concedido: false }
            : p,
        )
        .filter(p => p.concedido); // Remover permisos no concedidos
    }

    this.permisosService.setPermisosUsuarioEditando(userId, nuevosPermisos);
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
