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
import { Pago, PagoInfo } from '@pagos/interfaces';
import { PagosService } from '@pagos/services/pagos.service';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { AlertasService } from '@shared/services/alertas.service';
import { BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { AuthService } from '@auth/services/auth.service';
import { UpperFirstPipe } from '@shared/pipes';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { ModalPagoInfoComponent } from '@pagos/components/modal-pago-info/modal-pago-info.component';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';

interface Util {
  $implicit: CellContext<any, any>;
}

@Component({
  selector: 'tabla-pagos',
  templateUrl: './tabla-pagos.component.html',
  styleUrls: ['./tabla-pagos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FlexRenderDirective,
    ResponsiveTableDirective,
    UpperFirstPipe,
    TableExpansorComponent,
    ModalPagoInfoComponent,
    PaginadorComponent,
  ],
})
export class TablaPagosComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public pagosService = inject(PagosService);
  public alertaService = inject(AlertasService);

  public Math = Math;

  ngOnInit() {}

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public montoCell = viewChild.required<TemplateRef<Util>>('montoCell');
  public fechaCell = viewChild.required<TemplateRef<Util>>('fechaCell');

  // Estado modal info pago
  private _modalAbierto = signal(false);
  private _pagoInfo = signal<PagoInfo | null>(null);
  private _cargandoInfo = signal(false);
  private _errorInfo = signal<string | null>(null);
  private _ultimoCodigo = signal<string | null>(null);

  public modalAbierto = () => this._modalAbierto();
  public pagoInfo = () => this._pagoInfo();
  public cargandoInfo = () => this._cargandoInfo();
  public errorInfo = () => this._errorInfo();

  private columnasPorDefecto = signal<ColumnDef<Pago>[]>([
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
      id: 'fecha',
      accessorKey: 'creado_en',
      header: 'Fecha',
      size:100,
      cell: this.fechaCell,
    },
    {
      id: 'monto',
      accessorKey: 'valor',
      header: 'Monto',
      size: 100,
      cell: this.montoCell,
    },
    {
      id: 'estado',
      accessorKey: 'estado',
      header: 'Estado',
      cell: this.estadoCell,
    },
    {
      id: 'usuario',
      accessorFn: row =>
        `${row.reserva?.usuario_reserva?.persona?.primer_nombre || ''} ${
          row.reserva?.usuario_reserva?.persona?.segundo_nombre || ''
        } ${row.reserva?.usuario_reserva?.persona?.primer_apellido || ''} ${
          row.reserva?.usuario_reserva?.persona?.segundo_apellido || ''
        }` || 'N/A',
      header: 'Usuario',
      cell: info =>
        `<span class="max-sm:text-sm text-base">${info.getValue()}</span>`,
    },
    {
      id: 'espacio',
      accessorFn: row => row.reserva?.espacio?.nombre || 'N/A',
      header: 'Espacio',
      cell: info =>
        `<span class="max-sm:text-sm text-base">${info.getValue()}</span>`,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const acciones: BotonAcciones[] = [
          {
            tooltip: 'Ver detalles',
            icono: 'eye-outline',
            color: 'secondary',
            disabled: this.appService.editando(),
            eventoClick: () => this.verDetallesPago(context.row.original),
          },
        ];

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            visibles: context.column.getIsVisible(),
            acciones,
          },
        });
      },
    },
  ]);

  public alertaPago = viewChild.required('alertaPago', {
    read: ViewContainerRef,
  });

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  public tablaPagos = createAngularTable(() => ({
    data: this.pagosQuery.data() ?? [],
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
      pagination: this.pagosService.paginacion(),
      expanded: this.tableState().expanded,
      globalFilter: this.tableState().globalFilter,
    },
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.pagosService.paginacion())
          : estado;

      this.pagosService.setPaginacion({
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

  get pagosQuery() {
    return this.pagosService.pagosQuery;
  }

  public onToggleRow(row: Row<Pago>) {
    const rowId = row.id;
    const currentExpanded = this.tableState().expanded as Record<
      string,
      boolean
    >;

    const newExpanded = currentExpanded[rowId] ? {} : { [rowId]: true };

    this.tableState.update(state => ({
      ...state,
      expanded: newExpanded,
    }));
  }

  public verDetallesPago(pago: Pago) {
    // Abrir modal y cargar info
    this._modalAbierto.set(true);
    this.cargarInfoPago(pago.codigo);
  }

  onPageChange(estado: PaginationState): void {
    this.pagosService.setPaginacion(estado);
  }

  cerrarModal() {
    this._modalAbierto.set(false);
    this._pagoInfo.set(null);
    this._errorInfo.set(null);
  }

  async cargarInfoPago(codigo: string) {
    try {
      this._cargandoInfo.set(true);
      this._errorInfo.set(null);
      this._pagoInfo.set(null);
      this._ultimoCodigo.set(codigo);
      const { data } = await this.pagosService.obtenerInfoPago({ codigo });
      if (!data) throw new Error('No se encontró información del pago');
      this._pagoInfo.set(data);
    } catch (e: any) {
      this._errorInfo.set(e.message || 'Error al cargar la información');
    } finally {
      this._cargandoInfo.set(false);
    }
  }

  recargarInfoPago() {
    const codigo = this._ultimoCodigo();
    if (!codigo) return;
    this.cargarInfoPago(codigo);
  }
}
