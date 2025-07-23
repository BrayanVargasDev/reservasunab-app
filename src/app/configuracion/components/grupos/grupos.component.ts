import {
  Component,
  inject,
  computed,
  signal,
  viewChild,
  TemplateRef,
  ChangeDetectorRef,
  OnDestroy,
  Injector,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import {
  flexRenderComponent,
  ColumnDef,
  CellContext,
  Row,
  ExpandedState,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  FlexRenderDirective,
  PaginationState,
} from '@tanstack/angular-table';
import moment from 'moment';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { ConfigService } from '@configuracion/services/config.service';
import { AlertasService } from '@shared/services/alertas.service';
import { Grupo, BotonAcciones } from '@shared/interfaces';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { effect } from '@angular/core';
import { UpperFirstPipe } from '@shared/pipes';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'config-grupos',
  imports: [
    CommonModule,
    ResponsiveTableDirective,
    AccionesTablaComponent,
    FlexRenderDirective,
    ReactiveFormsModule,
    TableExpansorComponent,
    PaginadorComponent,
    UpperFirstPipe,
  ],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.scss',
})
export class GruposComponent implements OnInit, OnDestroy {
  private injector = inject(Injector);
  private upperFirstPipe = inject(UpperFirstPipe);
  private alertaService = inject(AlertasService);
  private cdr = inject(ChangeDetectorRef);
  private grupoEnEdicion = signal<Grupo | null>(null);

  public configService = inject(ConfigService);
  public appService = inject(AppService);
  public authService = inject(AuthService);

  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));
  public nombre = new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(3),
  ]);

  public modoCreacion = computed(() => this.configService.modoCreacionGrupo());

  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public accionesNuevo = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      disabled: this.appService.guardando(),
      eventoClick: (event: Event) => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      disabled: this.appService.guardando(),
      eventoClick: (event: Event) => this.onGuardarNuevo(),
    },
  ]);

  private columnasPorDefecto = signal<ColumnDef<Grupo>[]>([
    {
      id: 'nombre',
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: info =>
        `<span class="font-semibold text-sm md:text-base">${this.upperFirstPipe.transform(
          info.getValue() as unknown as string,
        )}</span>`,
    },
    {
      accessorKey: 'creado_en',
      header: `Creado en`,
      size: 200,
      accessorFn: row => {
        const date = moment(row.creado_en);
        return date.isValid()
          ? date.format('DD/MM/YYYY hh:mm a')
          : 'Fecha inválida';
      },
    },
    {
      id: 'estado',
      accessorKey: 'eliminado_en',
      header: 'Estado',
      cell: this.estadoCell,
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: context => {
        const id = context.row.original.id;
        const enEdicion = this.configService.filaGrupoEditando()[id];

        const accionesVerificadas = [];

        if (this.authService.tienePermisos('ESP000011')) {
          accionesVerificadas.push({
            tooltip: 'Editar',
            icono: 'pencil-outline',
            color: 'accent',
            disabled: this.appService.guardando() || this.appService.editando(),
            eventoClick: (event: Event) => this.iniciarEdicion(context.row),
          });
        }

        const acciones: BotonAcciones[] = enEdicion
          ? [
              {
                tooltip: 'Cancelar',
                icono: 'remove-circle-outline',
                color: 'error',
                disabled: this.appService.guardando(),
                eventoClick: (event: Event) =>
                  this.onCancelarEdicion(context.row),
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
                disabled: this.appService.guardando(),
                eventoClick: (event: Event) =>
                  this.onGuardarEdicion(context.row),
              },
            ]
          : accionesVerificadas;

        return flexRenderComponent(AccionesTablaComponent, {
          inputs: {
            acciones,
          },
        });
      },
    },
  ]);

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  readonly tablaGrupos = createAngularTable(() => ({
    data: this.gruposQuery ?? [],
    columns: this.columnasPorDefecto(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
    autoResetExpanded: false, // Mantener control manual de expansión
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
    autoResetPageIndex: false,
    state: {
      expanded: this.tableState().expanded,
      pagination: this.configService.paginacionGrupos(),
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
    onPaginationChange: estado => {
      const newPagination =
        typeof estado === 'function'
          ? estado(this.configService.paginacionGrupos())
          : estado;

      this.configService.setPaginacionGrupos({
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
  }));

  ngOnInit() {
    effect(
      () => {
        this.configService.pestana();

        if (this.configService.pestana() !== 'grupos') {
          this.nombre.reset();
          this.grupoEnEdicion.set(null);
          this.configService.resetAll();
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  get gruposQuery() {
    return this.configService.gruposQuery.data() || [];
  }

  public onPageChange(estado: PaginationState): void {
    this.configService.setPaginacionGrupos(estado);
  }

  public esColumnaEditable(columnId: string): boolean {
    const columnasEditables = ['nombre'];
    return columnasEditables.includes(columnId);
  }

  public cambiarEstadoConfig(grupo: Grupo) {
    const nuevoEstado = grupo.eliminado_en === null ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.appService.setGuardando(true);
    this.cdr.detectChanges();
    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} el grupo <strong>${grupo.nombre}</strong>?`,
        this.configService.alertaConfig()!,
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} grupo`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.configService
            .cambiarEstadoGrupo(grupo.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Grupo ${
                  accion === 'activar' ? 'activado' : 'desactivado'
                } exitosamente.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.configService.gruposQuery.refetch();
              this.appService.gruposQuery.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el grupo:`, error);
              this.alertaService.error(
                `Error al ${accion} el grupo. Por favor, inténtalo de nuevo.`,
                5000,
                this.configService.alertaConfig()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            })
            .finally(() => {
              this.appService.setGuardando(false);
              this.cdr.detectChanges();
            });
        } else {
          this.appService.setGuardando(false);
          this.cdr.detectChanges();
        }
      });
  }

  public crearGrupo() {
    this.configService.setModoCreacionGrupo(true);
    this.appService.setEditando(true);
    this.grupoEnEdicion.set(null);

    this.nombre.reset('');

    this.cdr.detectChanges();
  }

  private iniciarEdicion(row: Row<Grupo>) {
    const grupo = row.original;
    const id = grupo.id;

    this.configService.setEditandoFilaGrupo(id, true);
    this.grupoEnEdicion.set(grupo);
    this.appService.setEditando(true);

    setTimeout(() => {
      this.nombre.setValue(grupo.nombre);

      this.nombre.markAsPristine();

      this.cdr.detectChanges();
    }, 0);
  }

  public onCancelarEdicion(row: Row<Grupo>) {
    const id = row.original.id;
    this.configService.setEditandoFilaGrupo(id, false);
    this.configService.setModoCreacionGrupo(false);
    this.appService.setEditando(false);

    this.grupoEnEdicion.set(null);

    this.nombre.reset('');

    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.configService.setModoCreacionGrupo(false);
    this.appService.setEditando(false);

    this.nombre.reset('');

    this.cdr.detectChanges();
  }

  public async onGuardarNuevo() {
    this.nombre.markAsTouched();

    if (this.nombre.invalid) {
      this.alertaService.error(
        'Todos los campos son requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    this.appService.setGuardando(true);
    this.cdr.detectChanges();

    const nuevoGrupo: Partial<Grupo> = {
      nombre: this.nombre.value?.trim(),
    };

    try {
      await this.configService.crearGrupo(nuevoGrupo);

      this.alertaService.success(
        'Grupo creado exitosamente.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      this.cancelarCreacion();
      this.configService.gruposQuery.refetch();
      this.appService.gruposQuery.refetch();
    } catch (error) {
      console.error('Error al crear grupo:', error);
      this.alertaService.error(
        'Error al crear el grupo. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      this.appService.setGuardando(false);
    }
  }

  private async onGuardarEdicion(row: Row<Grupo>) {
    this.nombre.markAsTouched();

    if (this.nombre.invalid) {
      this.alertaService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    this.appService.setGuardando(true);
    this.cdr.detectChanges();

    const grupo = row.original;

    const grupoActualizado: Grupo = {
      ...grupo,
      nombre: this.nombre.value!,
    };

    try {
      await this.configService.actualizarGrupo(grupo.id, grupoActualizado);

      this.alertaService.success(
        'Grupo actualizado exitosamente.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      this.configService.setEditandoFilaGrupo(grupo.id, false);
      this.appService.setEditando(false);

      this.grupoEnEdicion.set(null);

      this.nombre.reset('');

      this.configService.gruposQuery.refetch();
      this.appService.gruposQuery.refetch();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
      this.alertaService.error(
        'Error al actualizar el grupo. Por favor, inténtalo de nuevo.',
        5000,
        this.configService.alertaConfig()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    } finally {
      this.appService.setGuardando(false);
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.configService.setModoCreacionGrupo(false);
    this.appService.setEditando(false);
    this.configService.setEditandoFilaGrupo(0, false);
    this.grupoEnEdicion.set(null);
    this.appService.setGuardando(false);
    this.nombre.reset();
  }
}
