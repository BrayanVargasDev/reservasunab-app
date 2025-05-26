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
} from '@angular/core';
import { IonicModule, IonChip } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  addOutline,
  chevronDownOutline,
  chevronForwardOutline,
  chevronUpOutline,
  createOutline,
  personCircle,
  trashOutline,
} from 'ionicons/icons';
import { Usuario } from '@usuarios/intefaces';

// Importaciones de @tanstack/angular-table
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
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from '../../../shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-usuarios-main',
  templateUrl: './usuarios-main.page.html',
  styleUrls: ['./usuarios-main.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule, // Agregado para habilitar ngModel
    FlexRenderDirective,
    ResponsiveTableDirective,
    TableExpansorComponent,
    TableAvatarComponent,
    WebIconComponent,
  ],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
})
export class UsuariosMainPage implements OnInit {
  public appService = inject(AppService);

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

  public usuariosModal =
    viewChild<ElementRef<HTMLDialogElement>>('usuariosModal');

  public usuariosData = signal<Usuario[]>([]);
  public columnas = signal<ColumnDef<Usuario>[]>([
    {
      id: 'avatar',
      accessorKey: 'avatar',
      header: '',
      cell: ({ row }) => {
        return flexRenderComponent(TableAvatarComponent, {
          inputs: {
            avatar: row.original.avatar,
          },
        });
      },
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
      accessorFn: (row) => `${row.nombre} ${row.apellido}`,
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
      cell: (info) => info.getValue(),
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
      cell: (info) => info.getValue(),
      accessorFn: (row) => {
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

  public tituloModal = signal<string>('Agregar Usuario');
  public colorModal = signal<string>('secondary');

  public tableState = signal({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    } as PaginationState,
    expanded: {} as ExpandedState,
  });

  table = createAngularTable(() => ({
    data: this.usuariosData(),
    columns: this.columnas(),
    state: this.tableState(),
    enableRowExpanding: true,
    getRowId: (row) => String(row.id),
    getSubRows: () => [],
    onExpandedChange: (updater) => {
      const currentExpanded = this.tableState().expanded;

      const newExpanded =
        typeof updater === 'function' ? updater(currentExpanded) : updater;

      const changedId = Object.keys(newExpanded).find(
        (id) =>
          (newExpanded as Record<string, boolean>)[id] !==
          (currentExpanded as Record<string, boolean>)[id],
      );

      if (changedId) {
        this.verDetalles(
          Number(changedId),
          (newExpanded as Record<string, boolean>)[changedId],
        );
      }

      this.tableState.update((state) => ({
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
    this.cargarUsuarios();
    addIcons({
      trashOutline,
      createOutline,
      addOutline,
      chevronDownOutline,
      chevronForwardOutline,
      chevronUpOutline,
      personCircle,
    });
  }

  cargarUsuarios() {
    const generarFechaAleatoria = (): string => {
      const hoy = new Date();
      const fechaAnterior = new Date(hoy);
      fechaAnterior.setFullYear(hoy.getFullYear() - 1);

      const fechaAleatoria = new Date(
        fechaAnterior.getTime() +
          Math.random() * (hoy.getTime() - fechaAnterior.getTime()),
      );

      const dia = fechaAleatoria.getDate().toString().padStart(2, '0');
      const mes = (fechaAleatoria.getMonth() + 1).toString().padStart(2, '0');
      const anio = fechaAleatoria.getFullYear() - 2000;
      const hora = fechaAleatoria.getHours() % 12 || 12;
      const minutos = fechaAleatoria.getMinutes().toString().padStart(2, '0');
      const ampm = fechaAleatoria.getHours() >= 12 ? 'PM' : 'AM';

      return `${dia}/${mes}/${anio} ${hora}:${minutos} ${ampm}`;
    };

    const usuarios = [
      {
        id: 1,
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@ejemplo.com',
        rol: 'Admin',
        estado: 'Activo',
        ultimoAcceso: generarFechaAleatoria(),
        tipoUsuario: 'Interno',
        documento: '12345678',
        fechaCreacion: generarFechaAleatoria(),
        avatar: '',
        viendoDetalles: false,
        telefono: '987654321',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '01/01/1990',
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'López',
        email: 'maria@ejemplo.com',
        rol: 'Usuario',
        estado: 'Activo',
        ultimoAcceso: generarFechaAleatoria(),
        tipoUsuario: 'Externo',
        documento: '87654321',
        fechaCreacion: generarFechaAleatoria(),
        avatar: '',
        viendoDetalles: false,
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '01/01/1990',
      },
      {
        id: 3,
        nombre: 'Carlos',
        apellido: 'Gómez',
        email: 'carlos@ejemplo.com',
        rol: 'Editor',
        estado: 'Inactivo',
        ultimoAcceso: generarFechaAleatoria(),
        tipoUsuario: 'Interno',
        documento: '23456789',
        fechaCreacion: generarFechaAleatoria(),
        avatar: '',
        viendoDetalles: false,
        telefono: '987654321',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '01/01/1990',
      },
      {
        id: 4,
        nombre: 'Ana',
        apellido: 'Ramírez',
        email: 'ana@ejemplo.com',
        rol: 'Usuario',
        estado: 'Activo',
        ultimoAcceso: generarFechaAleatoria(),
        tipoUsuario: 'Externo',
        documento: '34567890',
        fechaCreacion: generarFechaAleatoria(),
        avatar: '',
        viendoDetalles: false,
        telefono: '987654321',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '01/01/1990',
      },
      {
        id: 5,
        nombre: 'Roberto',
        apellido: 'Sánchez',
        email: 'roberto@ejemplo.com',
        rol: 'Editor',
        estado: 'Activo',
        ultimoAcceso: generarFechaAleatoria(),
        tipoUsuario: 'Interno',
        documento: '45678901',
        fechaCreacion: generarFechaAleatoria(),
        avatar: '',
        viendoDetalles: false,
        telefono: '123456789',
        direccion: 'Calle Falsa 123',
        fechaNacimiento: '01/01/1990',
      },
    ];

    this.usuariosData.set(usuarios);
  }

  aplicarFiltro() {
    if (!this.filtroTexto.trim()) {
      return;
    }

    const filtroLower = this.filtroTexto.toLowerCase();
    const usuariosFiltrados = this.usuariosData().filter((usuario) => {
      return (
        usuario.nombre.toLowerCase().includes(filtroLower) ||
        usuario.apellido.toLowerCase().includes(filtroLower) ||
        usuario.email.toLowerCase().includes(filtroLower) ||
        usuario.rol.toLowerCase().includes(filtroLower)
      );
    });

    this.usuariosData.set(usuariosFiltrados);
  }

  limpiarFiltro() {
    if (this.filtroTexto.trim()) {
      this.filtroTexto = '';
      this.cargarUsuarios();
    }
  }

  eliminarUsuario(id: number) {
    const usuariosActualizados = this.usuariosData().filter((u) => u.id !== id);
    this.usuariosData.set(usuariosActualizados);
  }

  async cerrarModal() {
    if (this.usuariosModal()) {
      this.usuariosModal()!.nativeElement.close();
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    this.tituloModal.set('Agregar Usuario');
    this.colorModal.set('secondary');
  }

  agregarUsuario() {
    this.tituloModal.set('Agregar Usuario');
    this.colorModal.set('secondary');

    if (this.usuariosModal()) {
      this.usuariosModal()!.nativeElement.showModal();
    }
  }

  editarUsuario(usuario: Usuario) {
    this.tituloModal.set('Editar Usuario');
    this.colorModal.set('accent');

    // Aquí podrías cargar los datos del usuario en un formulario para editar
    if (this.usuariosModal()) {
      this.usuariosModal()!.nativeElement.showModal();
    }
  }

  verDetalles(id: number, expanded: boolean) {
    this.usuariosData.update((usuarios) =>
      usuarios.map((usuario) => {
        if (usuario.id === id) {
          return {
            ...usuario,
            viendoDetalles: expanded,
          };
        }
        return usuario;
      }),
    );
  }

  // Método para expandir/contraer una fila manualmente desde el botón
  toggleRowExpanded(id: number) {
    const rowId = String(id);
    const currentExpanded =
      (this.tableState().expanded as Record<string, boolean>)[rowId] || false;

    this.tableState.update((state) => ({
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
}
