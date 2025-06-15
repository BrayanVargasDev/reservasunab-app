import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  input,
  computed,
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
} from '@tanstack/angular-table';
import moment from 'moment';

import { Rol } from '@permisos/interfaces';
import { PermisosService } from '@permisos/services/permisos.service';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { BotonAcciones } from '@shared/interfaces/boton-acciones.interface';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { AppService } from '@app/app.service';

@Component({
  selector: 'tabla-roles',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexRenderDirective,
    PaginadorComponent,
    AccionesTablaComponent,
  ],
  templateUrl: './tabla-roles.component.html',
  styleUrl: './tabla-roles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'flex flex-col grow w-full overflow-hidden',
  },
})
export class TablaRolesComponent {
  public appService = inject(AppService);
  private permisosService = inject(PermisosService);

  public modoCreacion = input<boolean>(false);
  public nombre = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  public descripcion = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));

  public accionesNuevoRol = computed<BotonAcciones[]>(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      eventoClick: (event: Event) => this.onCancelar(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      eventoClick: (event: Event) => this.onGuardar(),
    },
  ]);

  columnasPorDefecto = signal<ColumnDef<Rol>[]>([
    {
      id: 'nombre',
      accessorKey: 'nombre',
      header: () => 'Nombre',
    },
    {
      accessorKey: 'descripcion',
      header: () => 'Descripción',
    },
    {
      accessorKey: 'creadoEn',
      header: () => `Creado en`,
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
        const acciones: BotonAcciones[] = [
          {
            icono: 'pencil-outline',
            color: 'accent',
            tooltip: 'Editar',
            disabled: this.modoCreacion(),
            eventoClick: (event: Event) => {
              console.log('Editar', context.row.original);
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

  readonly tablaRoles = createAngularTable(() => ({
    data: this.rolesQuery.data() ?? [],
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  }));

  get rolesQuery() {
    return this.appService.rolesQuery;
  }

  public onCancelar() {
    this.appService.setEditando(false);
    this.permisosService.setModoCreacion(false);
    this.nombre.reset();
    this.descripcion.reset();
  }

  public onGuardar() {
    this.nombre.markAsTouched();
    this.descripcion.markAsTouched();

    console.log({
      nombre: this.nombre.value,
      descripcion: this.descripcion.value,
    });
    if (this.nombre.invalid || this.descripcion.invalid) {
      return;
    }

    const nuevoRol: Rol = {
      nombre: this.nombre.value,
      descripcion: this.descripcion.value,
      creadoEn: moment(this.fechaActual(), 'DD/MM/YYYY HH:mm a').format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      permisos: [],
    };

    console.log('Guardar nuevo rol:', nuevoRol);
    // Aquí iría la llamada al servicio para guardar el nuevo rol

    this.onCancelar();
  }
}
