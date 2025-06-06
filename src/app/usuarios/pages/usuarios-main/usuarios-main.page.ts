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
} from '@tanstack/angular-table';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { TableAvatarComponent } from '@shared/components/table-avatar/table-avatar.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { UsuariosService } from '@app/usuarios/services/usuarios.service';
import { ModalUsuariosComponent } from '../../components/modal-usuarios/modal-usuarios.component';
import { AlertasService } from '../../../shared/services/alertas.service';

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
  ],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
})
export class UsuariosMainPage implements OnInit {
  private usuariosService = inject(UsuariosService);
  private alertaService = inject(AlertasService);
  public appService = inject(AppService);

  protected readonly TableAvatarComponent = TableAvatarComponent;

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

  // Método para el avatar component
  private renderAvatar = (context: CellContext<Usuario, any>) => {
    return flexRenderComponent(this.TableAvatarComponent, {
      inputs: {
        avatar: context.row.original.avatar,
      },
    });
  };

  public columnas = signal<ColumnDef<Usuario>[]>([
    {
      id: 'avatar',
      accessorKey: 'avatar',
      header: '',
      cell: this.renderAvatar,
      size: 50,
      meta: {
        className: 'avatar-column',
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
      cell: () => (this.appService.esMovil() ? this.ionChip() : this.chipWeb()),
      meta: {
        className: 'estado-column',
        priority: 2,
      },
    },
    // {
    //   id: 'acciones',
    //   header: () => '',
    //   cell: (context) => {
    //     return flexRenderComponent(TableExpansorComponent, {
    //       inputs: {
    //         isExpanded: context.row.getIsExpanded(),
    //       },
    //       outputs: {
    //         toggleExpand: () => {
    //           context.row.toggleExpanded();
    //         },
    //       },
    //     });
    //   },
    //   meta: {
    //     responsive: false,
    //     className: 'acciones-column',
    //     priority: Infinity,
    //   },
    // },
  ]);

  public filtroTexto: string = '';

  public tableState = signal({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    } as PaginationState,
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
    data: this.usuariosFiltrados(),
    columns: this.columnas(),
    state: this.tableState(),
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

      if (changedId) {
        this.verDetalles(
          Number(changedId),
          (newExpanded as Record<string, boolean>)[changedId],
        );
      }

      this.tableState.update(state => ({
        ...state,
        expanded: newExpanded,
      }));
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
    debugAll: false,
  }));

  rows = computed(() => this.table.getRowModel().rows);
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

  aplicarFiltro() {
    // El filtro se aplica automáticamente a través del computed usuariosFiltrados
    // No necesitamos hacer nada más aquí, ya que la tabla usa los datos filtrados
  }

  limpiarFiltro() {
    this.filtroTexto = '';
  }

  verDetalles(id: number, expanded: boolean) {
    // this.usuariosData.update((usuarios) =>
    //   usuarios.map((usuario) => {
    //     if (usuario.id === id) {
    //       return {
    //         ...usuario,
    //         viendoDetalles: expanded,
    //       };
    //     }
    //     return usuario;
    //   }),
    // );
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

    this.verDetalles(id, !currentExpanded);
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

  cambiarRolUsuario(usuario: Usuario, nuevoRol: string) {
    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres cambiar el rol de ${usuario.nombre} ${usuario.apellido} a ${nuevoRol}?`,
        this.alertaUsuarios(),
        'Cambiar rol de usuario',
        'info'
      )
      .then((confirmado) => {
        if (confirmado) {
          this.usuariosService
            .cambiarRolUsuario(usuario.id, nuevoRol)
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
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';
    
    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} a ${usuario.nombre} ${usuario.apellido}?`,
        this.alertaUsuarios(),
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario`,
        nuevoEstado === 'activo' ? 'success' : 'warning'
      )
      .then((confirmado) => {
        if (confirmado) {
          this.usuariosService
            .cambiarEstadoUsuario(usuario.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Usuario ${accion === 'activar' ? 'activado' : 'desactivado'} exitosamente.`,
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

  eliminarUsuario(id: number) {
    this.alertaService
      .confirmarEliminacion(
        '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.',
        this.alertaUsuarios(),
        'Eliminar usuario'
      )
      .then((confirmado) => {
        if (confirmado) {
          this.usuariosService
            .eliminarUsuario(id)
            .then(() => {
              this.alertaService.success(
                'Usuario eliminado exitosamente.',
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.usuariosService.queryUsuarios.refetch();
            })
            .catch((error: any) => {
              console.error('Error al eliminar el usuario:', error);
              this.alertaService.error(
                'Error al eliminar el usuario. Por favor, inténtalo de nuevo.',
                5000,
                this.alertaUsuarios(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  activarUsuario(usuario: Usuario) {
    this.usuariosService
      .activarUsuario(usuario.id)
      .then(() => {
        this.alertaService.success(
          'Usuario activado exitosamente.',
          5000,
          this.alertaUsuarios(),
          'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
        );
        this.usuariosService.queryUsuarios.refetch();
      })
      .catch(error => {
        console.error('Error al activar el usuario:', error);
        this.alertaService.error(
          'Error al activar el usuario. Por favor, inténtalo de nuevo.',
          5000,
          this.alertaUsuarios(),
          'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
        );
      });
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
