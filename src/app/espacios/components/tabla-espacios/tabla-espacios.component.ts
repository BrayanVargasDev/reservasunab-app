import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  inject,
  ViewContainerRef,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import {
  ColumnDef,
  flexRenderComponent,
  FlexRenderDirective,
  ExpandedState,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  Row,
  CellContext,
  PaginationState,
} from '@tanstack/angular-table';

import { AppService } from '@app/app.service';
import { Espacio } from '@espacios/interfaces';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { EspaciosService } from '@espacios/services/espacios.service';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { AlertasService } from '@shared/services/alertas.service';
import { BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { AuthService } from '@auth/services/auth.service';
import { UpperFirstPipe } from '@shared/pipes';
import { PERMISOS_ESPACIOS } from '@shared/constants';

interface Util {
  $implicit: CellContext<any, any>;
}

@Component({
  selector: 'tabla-espacios',
  templateUrl: './tabla-espacios.component.html',
  styleUrls: ['./tabla-espacios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FlexRenderDirective,
    PaginadorComponent,
    ResponsiveTableDirective,
    TableExpansorComponent,
    UpperFirstPipe,
  ],
})
export class TablaEspaciosComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public espaciosService = inject(EspaciosService);
  public alertaService = inject(AlertasService);

  // Constantes de permisos
  readonly permisos = PERMISOS_ESPACIOS;

  ngOnInit() {}

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');

  private columnasPorDefecto = signal<ColumnDef<Espacio>[]>([
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      cell: info => `<span class="font-bold">${info.getValue()}</span>`,
    },
    {
      id: 'nombre',
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: info =>
        `${(info.getValue() as unknown as string).toUpperCase()}`,
    },
    {
      id: 'sede',
      accessorKey: 'sede',
      header: 'Ubicación',
      cell: info => `${info.getValue()}`,
    },
    {
      id: 'tipoEspacio',
      accessorKey: 'tipoEspacio',
      header: 'Tipo de Espacio',
      cell: info =>
        `<span class="uppercase font-semibold">${info.getValue()}</span>`,
    },
    {
      id: 'estado',
      accessorKey: 'estado',
      header: 'Estado',
      cell: this.estadoCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const acciones: BotonAcciones[] = this.authService.tienePermisos(
          this.permisos.CONFIGURAR_ESPACIOS,
        )
          ? [
              {
                tooltip: 'Configurar',
                icono: 'construct-outline',
                color: 'secondary',
                disabled: this.appService.editando(),
                eventoClick: () =>
                  this.router.navigate(
                    ['configuracion', context.row.original.id],
                    {
                      relativeTo: this.route,
                    },
                  ),
              },
            ]
          : [];

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            visibles: context.column.getIsVisible(),
            acciones,
          },
        });
      },
    },
  ]);

  public alertaEspacio = viewChild.required('alertaEspacio', {
    read: ViewContainerRef,
  });

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  public tablaEspacios = createAngularTable(() => ({
    data: this.espaciosQuery.data() ?? [],
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
      pagination: this.espaciosService.paginacion(),
      expanded: this.tableState().expanded,
      globalFilter: this.tableState().globalFilter,
    },
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.espaciosService.paginacion())
          : estado;

      this.espaciosService.setPaginacion({
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

  get espaciosQuery() {
    return this.espaciosService.espaciosQuery;
  }

  public onToggleRow(row: Row<Espacio>, editing = false) {
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
    }

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  public cambiarEstadoEspacio(espacio: Espacio) {
    const nuevoEstado =
      espacio.estado.toLowerCase() === 'activo' ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} a  el espacio <strong>${espacio.nombre}</strong>?`,
        this.alertaEspacio(),
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} espacio`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.espaciosService
            .cambiarEstadoEspacio(espacio.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Espacio ${
                  accion === 'activar' ? 'activado' : 'desactivado'
                } exitosamente.`,
                5000,
                this.alertaEspacio(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.espaciosService.espaciosQuery.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el espacio:`, error);
              this.alertaService.error(
                `Error al ${accion} el espacio. Por favor, inténtalo de nuevo.`,
                5000,
                this.alertaEspacio(),
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  onPageChange(estado: PaginationState): void {
    this.espaciosService.setPaginacion(estado);
  }
}
