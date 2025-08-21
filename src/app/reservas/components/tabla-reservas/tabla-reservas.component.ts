import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

import { Reserva } from '@reservas/interfaces';
import { ReservasAdminService } from '@reservas/services/reservas-admin.service';
import { AppService } from '@app/app.service';
import { AlertasService } from '@shared/services/alertas.service';
import { AuthService } from '@auth/services/auth.service';
import { BotonAcciones } from '@shared/interfaces';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { PagosService } from '@pagos/services/pagos.service';
import { UpperFirstPipe } from '@shared/pipes';

interface Util {
  $implicit: CellContext<any, any>;
}

@Component({
  selector: 'tabla-reservas',
  templateUrl: './tabla-reservas.component.html',
  styleUrls: ['./tabla-reservas.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FlexRenderDirective,
    PaginadorComponent,
    ResponsiveTableDirective,
    TableExpansorComponent,
    UpperFirstPipe,
  ],
})
export class TablaReservasComponent {
  private router = inject(Router);
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public reservasService = inject(ReservasAdminService);
  public alertaService = inject(AlertasService);
  public pagoService = inject(PagosService);

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public codigoCell = viewChild.required<TemplateRef<Util>>('codigoCell');
  public horasCell = viewChild.required<TemplateRef<Util>>('horasCell');

  private columnasPorDefecto = signal<ColumnDef<Reserva>[]>([
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      size: 30,
      meta: {
        priority: Infinity,
      },
      cell: info =>
        `<span class="font-bold max-sm:text-sm text-base">${info.getValue()}</span>`,
    },
    {
      id: 'codigo',
      accessorKey: 'codigo',
      header: 'Código',
      size: 300,
      cell: this.codigoCell,
    },
    {
      id: 'usuario',
      header: 'Usuario',
      size: 300,
      meta: {
        priority: Infinity,
      },
      cell: info => {
        const persona = info.row.original.usuario_reserva?.persona;
        if (!persona) return '';
        return `<span class="font-bold max-sm:text-sm text-base">${persona.primer_nombre} ${persona.primer_apellido}</span>`;
      },
    },
    {
      id: 'espacio',
      header: 'Espacio',
      size: 300,
      cell: info => `${info.row.original.espacio?.nombre || ''}`,
    },
    {
      id: 'fecha',
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: info => new Date(info.getValue() as string).toLocaleDateString(),
    },
    {
      id: 'horas',
      header: 'Horario',
      cell: this.horasCell,
    },
    {
      id: 'estado',
      accessorKey: 'estado',
      header: 'Estado',
      size: 150,
      cell: this.estadoCell,
      accessorFn: row => this.pagoService.obtenerMensajeEstadoBadge(row.estado),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      size: 100,
      meta: {
        priority: Infinity,
      },
      cell: context => {
        const reserva = context.row.original;
        const acciones: BotonAcciones[] = [];
        if (
          reserva.estado === 'pendienteap' &&
          this.authService.tienePermisos?.('RSV000001')
        ) {
          acciones.push({
            tooltip: 'Aprobar',
            icono: 'checkmark-done-circle-outline',
            color: 'success',
            disabled: this.appService.editando?.(),
            eventoClick: () => this.aprobarReserva(reserva),
          });
        }
        if (this.authService.tienePermisos?.('RSV000002')) {
          acciones.push({
            tooltip: 'Eliminar',
            icono: 'trash-outline',
            color: 'error',
            disabled: this.appService.editando?.(),
            eventoClick: () => this.eliminarReserva(reserva),
          });
        }
        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            visibles: context.column.getIsVisible(),
            acciones,
          },
        });
      },
    },
  ]);

  public alertaReserva = viewChild.required('alertaReserva', {
    read: ViewContainerRef,
  });

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  public tablaReservas = createAngularTable(() => ({
    data: this.reservasQuery.data() ?? [],
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
      pagination: this.reservasService.paginacion(),
      expanded: this.tableState().expanded,
      globalFilter: this.tableState().globalFilter,
    },
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.reservasService.paginacion())
          : estado;
      this.reservasService.setPaginacion({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
    onExpandedChange: estado => {
      const newExpanded =
        typeof estado === 'function'
          ? estado(this.tableState().expanded)
          : estado;
      this.tableState.update(state => ({ ...state, expanded: newExpanded }));
    },
  }));

  get reservasQuery() {
    return this.reservasService.reservasQuery;
  }

  public onToggleRow(row: Row<Reserva>, editing = false) {
    const rowId = row.id;
    const currentExpanded = this.tableState().expanded as Record<
      string,
      boolean
    >;
    let newExpanded: Record<string, boolean>;
    if (editing) newExpanded = { [rowId]: true };
    else newExpanded = currentExpanded[rowId] ? {} : { [rowId]: true };
    this.tableState.update(state => ({ ...state, expanded: newExpanded }));
  }

  public aprobarReserva(reserva: Reserva) {
    this.alertaService
      .confirmarAccion(
        `¿Aprobar la reserva <strong>${reserva.codigo}</strong>?`,
        this.alertaReserva(),
        'Aprobar reserva',
        'success',
      )
      .then(confirmado => {
        if (!confirmado) return;
        this.reservasService
          .aprobar(reserva.id)
          .then(() => {
            this.alertaService.success(
              'Reserva aprobada exitosamente.',
              5000,
              this.alertaReserva(),
              'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
            );
            this.reservasService.reservasQuery.refetch();
          })
          .catch(err => {
            console.error(err);
            this.alertaService.error(
              'Error al aprobar la reserva.',
              5000,
              this.alertaReserva(),
              'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
            );
          });
      });
  }

  public eliminarReserva(reserva: Reserva) {
    this.alertaService
      .confirmarAccion(
        `¿Eliminar la reserva <strong>${reserva.codigo}</strong>?`,
        this.alertaReserva(),
        'Eliminar reserva',
        'warning',
      )
      .then(confirmado => {
        if (!confirmado) return;
        this.reservasService
          .eliminar(reserva.id)
          .then(() => {
            this.alertaService.success(
              'Reserva eliminada.',
              5000,
              this.alertaReserva(),
              'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
            );
            this.reservasService.reservasQuery.refetch();
          })
          .catch(err => {
            console.error(err);
            this.alertaService.error(
              'Error al eliminar la reserva.',
              5000,
              this.alertaReserva(),
              'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
            );
          });
      });
  }

  onPageChange(estado: PaginationState): void {
    this.reservasService.setPaginacion(estado);
  }
}
