import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { IonicModule, IonChip } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  addOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  createOutline,
  personCircle,
  trashOutline,
  caretDownOutline,
  openOutline,
  cameraOutline,
  refreshOutline,
} from 'ionicons/icons';
import { Usuario } from '@usuarios/intefaces';

import {
  CellContext,
  ColumnDef,
  ExpandedState,
  FlexRenderDirective,
  PaginationState,
  createAngularTable,
  flexRenderComponent,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/angular-table';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { UsuariosService } from '@app/usuarios/services/usuarios.service';
import { ModalUsuariosComponent } from '@usuarios/components/modal-usuarios/modal-usuarios.component';
import { AlertasService } from '@shared/services/alertas.service';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { Rol } from '../../../permisos/interfaces/rol.interface';

@Component({
  selector: 'app-usuarios-main',
  templateUrl: './usuarios-main.page.html',
  styleUrls: ['./usuarios-main.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexRenderDirective,
    ResponsiveTableDirective,
    TableExpansorComponent,
    WebIconComponent,
    ModalUsuariosComponent,
    PaginadorComponent,
  ],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative overflow-y-auto',
  },
})
export class UsuariosMainPage implements OnInit {
  private alertaService = inject(AlertasService);
  public usuariosService = inject(UsuariosService);
  public appService = inject(AppService);

  public alertaUsuarios = viewChild.required('alertaUsuarios', {
    read: ViewContainerRef,
  });
  public ionChip =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'ionChip',
    );

  public chipWeb =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'chipWeb',
    );

  public celdaNombre =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'celdaNombre',
    );

  public celdaRol =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'celdaRol',
    );

  public columnas = signal<ColumnDef<Usuario>[]>([
    {
      id: 'documento',
      header: 'Documento',
      accessorKey: 'documento',
      cell: info => `<span class="font-bold">${info.getValue()}</span>`,
      size: 300,
      meta: {
        priority: Infinity,
      },
    },
    {
      id: 'nombreCompleto',
      accessorKey: 'nombreCompleto',
      header: 'Nombre',
      accessorFn: row => `${row.nombre} ${row.apellido}`,
      cell: () => this.celdaNombre(),
      meta: {
        className: 'nombre-column',
        priority: Infinity,
      },
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      cell: info => info.getValue(),
      meta: {
        className: 'email-column',
        priority: 3,
      },
    },
    {
      id: 'rol',
      header: 'Rol',
      accessorKey: 'rol',
      size: 300,
      cell: () => this.celdaRol(),
      meta: {
        className: 'rol-column',
        priority: 3,
      },
    },
    {
      id: 'fechaCreacion',
      header: 'Fecha Creación',
      cell: info => {
        const fecha = info.getValue();
        return new Date(fecha as string).toLocaleString();
      },
      accessorFn: row => {
        return row.fechaCreacion.split(' ')[0];
      },
      accessorKey: 'fechaCreacion',
      meta: {
        className: 'fecha-column',
        priority: 1,
      },
    },
    {
      id: 'estado',
      header: 'Estado',
      accessorKey: 'estado',
      size: 300,
      cell: () => (this.appService.esMovil() ? this.ionChip() : this.chipWeb()),
      meta: {
        className: 'estado-column',
        priority: 2,
      },
    },
  ]);

  public filtroTexto: string = '';

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  // Signal para los datos filtrados
  public usuariosFiltrados = computed(() => {
    const usuarios = this.usuariosQuery.data() || [];
    if (!this.filtroTexto.trim()) {
      return usuarios;
    }

    const filtroLower = this.filtroTexto.toLowerCase();
    return usuarios.filter(usuario => {
      return (
        usuario.nombre.toLowerCase().includes(filtroLower) ||
        usuario.apellido.toLowerCase().includes(filtroLower) ||
        usuario.email.toLowerCase().includes(filtroLower) ||
        usuario.rol.toLowerCase().includes(filtroLower)
      );
    });
  });

  table = createAngularTable(() => ({
    data: this.usuariosQuery.data()!,
    columns: this.columnas(),
    state: {
      ...this.tableState(),
      pagination: this.usuariosService.paginacion(),
    },
    enableRowExpanding: true,
    getRowId: row => String(row.id),
    getSubRows: () => [],
    onExpandedChange: updater => {
      const currentExpanded = this.tableState().expanded;

      const newExpanded =
        typeof updater === 'function' ? updater(currentExpanded) : updater;

      const changedId = Object.keys(newExpanded).find(
        id =>
          (newExpanded as Record<string, boolean>)[id] !==
          (currentExpanded as Record<string, boolean>)[id],
      );

      this.tableState.update(state => ({
        ...state,
        expanded: newExpanded,
      }));
    },
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.usuariosService.paginacion())
          : estado;

      this.usuariosService.setPaginacion({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
    autoResetPageIndex: false,
    debugAll: false,
  }));

  columns = computed(() => this.table.getAllColumns());
  headerGroups = computed(() => this.table.getHeaderGroups());

  ngOnInit() {
    addIcons({
      trashOutline,
      createOutline,
      addOutline,
      chevronDownOutline,
      chevronForwardOutline,
      chevronUpOutline,
      personCircle,
      caretDownOutline,
      openOutline,
      cameraOutline,
      refreshOutline,
    });
  }

  get usuariosQuery() {
    return this.usuariosService.queryUsuarios;
  }

  get rolesQuery() {
    return (
      this.appService.rolesQuery
        .data()
        ?.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '')) || []
    );
  }

  aplicarFiltro() {
    // El filtro se aplica automáticamente a través del computed usuariosFiltrados
    // No necesitamos hacer nada más aquí, ya que la tabla usa los datos filtrados
  }

  limpiarFiltro() {
    this.filtroTexto = '';
  }

  toggleRowExpanded(id: number) {
    const rowId = String(id);
    const currentExpanded =
      (this.tableState().expanded as Record<string, boolean>)[rowId] || false;

    this.tableState.update(state => ({
      ...state,
      expanded: {
        ...(state.expanded as object),
        [rowId]: !currentExpanded,
      },
    }));
  }

  isRowExpanded(id: number): boolean {
    return !!(this.tableState().expanded as Record<string, boolean>)[
      String(id)
    ];
  }

  // * Gestión del usuario
  crearUsuario() {
    this.usuariosService.abrirModal();
  }

  editarUsuario(usuario: Usuario) {
    this.usuariosService.setUsuarioAEditar(usuario);
    this.usuariosService.setModoEdicion(true);
    this.usuariosService.abrirModal();
  }

  cambiarRolUsuario(usuario: Usuario, nuevoRol: Rol) {
    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres cambiar el rol de <strong>${usuario.nombre} ${usuario.apellido}</strong> a <strong>${nuevoRol.nombre}</strong>?`,
        this.alertaUsuarios(),
        'Cambiar rol de usuario',
        'info',
      )
      .then(confirmado => {
        if (confirmado) {
          this.usuariosService
            .cambiarRolUsuario(usuario.id, nuevoRol.id || 0)
            .then(() => {
              this.alertaService.success(
                'Rol de usuario actualizado exitosamente.',
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.usuariosService.queryUsuarios.refetch();
            })
            .catch((error: any) => {
              console.error('Error al cambiar el rol del usuario:', error);
              this.alertaService.error(
                'Error al cambiar el rol del usuario. Por favor, inténtalo de nuevo.',
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  cambiarEstadoUsuario(usuario: Usuario) {
    const nuevoEstado =
      usuario.estado.toLowerCase() === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} a ${usuario.nombre} ${usuario.apellido}?`,
        this.alertaUsuarios(),
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.usuariosService
            .cambiarEstadoUsuario(usuario.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Usuario ${
                  accion === 'activar' ? 'activado' : 'desactivado'
                } exitosamente.`,
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.usuariosService.queryUsuarios.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el usuario:`, error);
              this.alertaService.error(
                `Error al ${accion} el usuario. Por favor, inténtalo de nuevo.`,
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  refrescarDatos() {
    this.usuariosService.queryUsuarios.refetch();
  }

  onPageChange(estado: PaginationState): void {
    this.usuariosService.setPaginacion(estado);
  }

  usuarioGuardadoExitoso(event: boolean) {
    const estilosAlerta =
      'fixed flex p-4 transition-all ease-in-out bottom-4 right-4';
    if (event) {
      this.alertaService.success(
        'Usuario guardado exitosamente.',
        50000,
        this.alertaUsuarios(),
        estilosAlerta,
      );
    } else {
      this.alertaService.error(
        'Error al guardar el usuario. Por favor, inténtalo de nuevo.',
        50000,
        this.alertaUsuarios(),
        estilosAlerta,
      );
    }
  }
}
