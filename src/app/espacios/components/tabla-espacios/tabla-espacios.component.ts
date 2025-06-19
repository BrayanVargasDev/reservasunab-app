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
} from '@tanstack/angular-table';

import { AppService } from '@app/app.service';
import { Espacio } from '@espacios/interfaces';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { EspaciosService } from '@espacios/services/espacios.service';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';

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
  ],
})
export class TablaEspaciosComponent implements OnInit {
  public appService = inject(AppService);
  public espaciosService = inject(EspaciosService);

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
      cell: info => `${info.getValue()}`,
    },
    {
      id: 'descripcion',
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: info => `${info.getValue()}`,
    },
    {
      id: 'tipoEspacio',
      accessorKey: 'tipoEspacio',
      header: 'Tipo de Espacio',
      cell: info => info.getValue(),
    },
    {
      id: 'estado',
      accessorKey: 'estado',
      header: 'Estado',
      cell: this.estadoCell,
    },
    // {
    //   id: 'acciones',
    //   header: 'Acciones',
    //   cell: context => {
    //     const id = context.row.original.id_usuario;
    //     const enEdicion = this.espaciosService.filaPermisosEditando()[id];

    //     const acciones: BotonAcciones[] = enEdicion
    //       ? [
    //           {
    //             tooltip: 'Cancelar',
    //             icono: 'remove-circle-outline',
    //             color: 'error',
    //             eventoClick: () => this.onCancelarEdicionUsuario(context.row),
    //           },
    //           {
    //             tooltip: 'Guardar',
    //             icono: 'save-outline',
    //             color: 'success',
    //             eventoClick: () => this.onGuardarEdicionUsuario(context.row),
    //           },
    //         ]
    //       : [
    //           {
    //             tooltip: 'Editar',
    //             icono: 'pencil-outline',
    //             color: 'accent',
    //             disabled:
    //               this.appService.editando() ||
    //               this.espaciosService.modoCreacion(),
    //             eventoClick: () => this.iniciarEdicionUsuario(context.row),
    //           },
    //         ];

    //     return flexRenderComponent(AccionesTablaComponent, {
    //       inputs: {
    //         acciones,
    //       },
    //     });
    //   },
    // },
  ]);

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
}
