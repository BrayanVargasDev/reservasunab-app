import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  signal,
  viewChild,
  TemplateRef,
  Injector,
  input,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ExpandedState,
  createAngularTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  CellContext,
  ColumnDef,
  flexRenderComponent,
  FlexRenderDirective,
  Row,
} from '@tanstack/angular-table';
import moment from 'moment';

import { AppService } from '@app/app.service';
import { BotonAcciones } from '@shared/interfaces';
import { AlertasService } from '@shared/services/alertas.service';
import { TipoUsuarioConfig } from '@espacios/interfaces/tipo-usuario-config.interface';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { AccionesTablaComponent } from '@shared/components/acciones-tabla/acciones-tabla.component';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ResponsiveTableDirective } from '@app/shared/directives/responsive-table.directive';
import { TipoUsuario } from '@shared/enums';
import { createTipoUsuarioConfig } from '@espacios/actions';
import { AuthService } from '@auth/services/auth.service';

interface Util {
  $implicit: CellContext<any, any>;
  data: BotonAcciones[];
}

@Component({
  selector: 'tabla-config-tipo-usuario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexRenderDirective,
    WebIconComponent,
    AccionesTablaComponent,
    ResponsiveTableDirective,
    TableExpansorComponent,
  ],
  templateUrl: './tabla-config-tipo-usuario.component.html',
  styleUrl: './tabla-config-tipo-usuario.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaConfigTipoUsuarioComponent {
  private injector = inject(Injector);
  private alertasService = inject(AlertasService);
  public espaciosConfigService = inject(EspaciosConfigService);
  private alertaService = inject(AlertasService);
  public authService = inject(AuthService);
  private tipoUsrConfigEnEdicion = signal<TipoUsuarioConfig | null>(null);
  public estadoCell = viewChild.required<TemplateRef<Util>>('estadoCell');
  public fechaActual = computed(() => moment().format('DD/MM/YYYY HH:mm a'));
  public tiposUsuarios = computed<TipoUsuario[]>(() => [
    TipoUsuario.Administrativo,
    TipoUsuario.Egresado,
    TipoUsuario.Estudiante,
    TipoUsuario.Externo,
  ]);

  public tiposUsuariosDisponibles = computed<TipoUsuario[]>(() => {
    const configurados = this.configsTipoUsurioQuery.map(
      config => config.tipo_usuario,
    );
    return this.tiposUsuarios().filter(tipo => !configurados.includes(tipo));
  });

  public puedeCrearNueva = computed(() => {
    return this.tiposUsuariosDisponibles().length > 0;
  });

  public accionesNuevo = computed(() => [
    {
      icono: 'remove-circle-outline',
      color: 'error',
      tooltip: 'Cancelar',
      eventoClick: (event: Event) => this.cancelarCreacion(),
    },
    {
      icono: 'save-outline',
      color: 'success',
      tooltip: 'Guardar',
      eventoClick: (event: Event) => this.onGuardarNuevo(),
    },
  ]);

  private columnasPorDefecto = signal<ColumnDef<TipoUsuarioConfig>[]>([
    {
      id: 'tipo_usuario',
      accessorKey: 'tipo_usuario',
      header: 'Tipo de Usuario',
      cell: info =>
        `<span class="capitalize font-semibold">${info.getValue()}</span>`,
    },
    {
      id: 'porcentaje_descuento',
      accessorKey: 'porcentaje_descuento',
      size: 150,
      header: 'Porcentaje Descuento',
      cell: info => info.getValue() + '%',
    },
    {
      id: 'retraso_reserva',
      accessorKey: 'retraso_reserva',
      size: 150,
      header: 'Minutos de Retraso',
      cell: info => info.getValue() + ' min',
    },
    {
      accessorKey: 'creado_en',
      header: `Creado en`,
      size: 200,
      accessorFn: row => {
        const date = moment(row.creado_en);
        return date.isValid()
          ? date.format('DD/MM/YYYY HH:mm a')
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
        const enEdicion = this.espaciosConfigService.filaConfigEditando()[id];

        const accionesVerificadas = [];

        if (this.authService.tienePermisos('ESP000011')) {
          accionesVerificadas.push({
            tooltip: 'Editar',
            icono: 'pencil-outline',
            color: 'accent',
            disabled: this.appService.editando(),
            eventoClick: (event: Event) => this.iniciarEdicion(context.row),
          });
        }

        const acciones: BotonAcciones[] = enEdicion
          ? [
              {
                tooltip: 'Cancelar',
                icono: 'remove-circle-outline',
                color: 'error',
                eventoClick: (event: Event) =>
                  this.onCancelarEdicion(context.row),
              },
              {
                tooltip: 'Guardar',
                icono: 'save-outline',
                color: 'success',
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

  public tipo_usuario = new FormControl<string>('', [Validators.required]);
  public porcentaje_descuento = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(100),
  ]);
  public minutos_retraso = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);
  public appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  public celdaAcciones = viewChild.required<TemplateRef<Util>>('celdaAcciones');

  public tableState = signal({
    expanded: {} as ExpandedState,
  });

  public modoCreacion = computed(() =>
    this.espaciosConfigService.modoCreacionTipoConfig(),
  );

  readonly tablaTipoUsuarioConfig = createAngularTable(() => ({
    data: this.configsTipoUsurioQuery ?? [],
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

  get configsTipoUsurioQuery() {
    return (
      this.espaciosConfigService.espacioQuery.data()?.tipo_usuario_config || []
    );
  }

  public esColumnaEditable(columnId: string): boolean {
    const columnasEditables = ['porcentaje_descuento', 'retraso_reserva'];
    return columnasEditables.includes(columnId);
  }

  public cambiarEstadoConfig(config: TipoUsuarioConfig) {
    const nuevoEstado = config.eliminado_en === null ? 'inactivo' : 'activo';
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar';

    this.alertaService
      .confirmarAccion(
        `¿Estás seguro de que quieres ${accion} a la configuración para <strong>${config.tipo_usuario}</strong>?`,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        `${accion.charAt(0).toUpperCase() + accion.slice(1)} config`,
        nuevoEstado === 'activo' ? 'success' : 'warning',
      )
      .then(confirmado => {
        if (confirmado) {
          this.espaciosConfigService
            .cambiarEstadoTipoConfig(config.id, nuevoEstado)
            .then(() => {
              this.alertaService.success(
                `Espacio ${
                  accion === 'activar' ? 'activado' : 'desactivado'
                } exitosamente.`,
                5000,
                this.espaciosConfigService.alertaEspacioConfigRef()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
              this.espaciosConfigService.espacioQuery.refetch();
            })
            .catch((error: any) => {
              console.error(`Error al ${accion} el config:`, error);
              this.alertaService.error(
                `Error al ${accion} el config. Por favor, inténtalo de nuevo.`,
                5000,
                this.espaciosConfigService.alertaEspacioConfigRef()!,
                'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
              );
            });
        }
      });
  }

  public crearTipoConfig() {
    if (!this.puedeCrearNueva()) {
      this.alertasService.warning(
        'No hay tipos de usuario disponibles para configurar.',
        3000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    this.espaciosConfigService.setModoCreacionTipoConfig(true);
    this.appService.setEditando(true);
    this.tipoUsrConfigEnEdicion.set(null);

    this.tipo_usuario.reset('');
    this.porcentaje_descuento.reset();
    this.minutos_retraso.reset();

    this.cdr.detectChanges();
  }

  private cancelarCreacion() {
    this.espaciosConfigService.setModoCreacionTipoConfig(false);
    this.appService.setEditando(false);

    this.tipo_usuario.reset('');
    this.porcentaje_descuento.reset();
    this.minutos_retraso.reset();

    this.cdr.detectChanges();
  }

  public onCancelarEdicion(row: Row<TipoUsuarioConfig>) {
    const id = row.original.id;
    this.espaciosConfigService.setEditandoFilaConfig(id, false);
    this.espaciosConfigService.setModoCreacionTipoConfig(false);
    this.appService.setEditando(false);

    this.tipoUsrConfigEnEdicion.set(null);

    this.tipo_usuario.reset('');
    this.porcentaje_descuento.reset();
    this.minutos_retraso.reset();

    this.cdr.detectChanges();
  }

  private iniciarEdicion(row: Row<TipoUsuarioConfig>) {
    const tipoUsuarioConfig = row.original;
    const id = tipoUsuarioConfig.id;

    this.espaciosConfigService.setEditandoFilaConfig(id, true);
    this.tipoUsrConfigEnEdicion.set(tipoUsuarioConfig);
    this.appService.setEditando(true);

    setTimeout(() => {
      this.tipo_usuario.setValue(tipoUsuarioConfig.tipo_usuario);
      this.porcentaje_descuento.setValue(
        tipoUsuarioConfig.porcentaje_descuento,
      );
      this.minutos_retraso.setValue(tipoUsuarioConfig.retraso_reserva);

      this.tipo_usuario.markAsPristine();
      this.porcentaje_descuento.markAsPristine();
      this.minutos_retraso.markAsPristine();

      this.cdr.detectChanges();
    }, 0);
  }

  private async onGuardarEdicion(row: Row<TipoUsuarioConfig>) {
    this.tipo_usuario.markAsTouched();
    this.porcentaje_descuento.markAsTouched();
    this.minutos_retraso.markAsTouched();

    if (
      this.tipo_usuario.invalid ||
      this.porcentaje_descuento.invalid ||
      this.minutos_retraso.invalid
    ) {
      this.alertasService.error(
        'Por favor, complete todos los campos requeridos.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    const config = row.original;

    const configActualizada: TipoUsuarioConfig = {
      ...config,
      tipo_usuario: this.tipo_usuario.value! as TipoUsuario,
      porcentaje_descuento: this.porcentaje_descuento.value!,
      retraso_reserva: this.minutos_retraso.value!,
    };

    try {
      await this.espaciosConfigService.actualizarTipoUsuarioConfig(
        config.id,
        configActualizada,
      );

      this.alertasService.success(
        'Configuración actualizada exitosamente.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      this.espaciosConfigService.setEditandoFilaConfig(config.id, false);
      this.appService.setEditando(false);
      this.tipoUsrConfigEnEdicion.set(null);

      this.tipo_usuario.reset('');
      this.porcentaje_descuento.reset();
      this.minutos_retraso.reset();

      this.espaciosConfigService.espacioQuery.refetch();

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
      this.alertasService.error(
        'Error al actualizar la configuración. Por favor, inténtalo de nuevo.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }

  public async onGuardarNuevo() {
    this.tipo_usuario.markAsTouched();
    this.porcentaje_descuento.markAsTouched();
    this.minutos_retraso.markAsTouched();

    console.log({
      tipo_usuario: this.tipo_usuario.value,
      porcentaje_descuento: this.porcentaje_descuento.value,
      minutos_retraso: this.minutos_retraso.value,
    });

    if (
      this.tipo_usuario.invalid ||
      this.porcentaje_descuento.invalid ||
      this.minutos_retraso.invalid
    ) {
      this.alertasService.error(
        'Todos los campos son requeridos.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    const tipoSeleccionado = this.tipo_usuario.value! as TipoUsuario;
    if (!this.tiposUsuariosDisponibles().includes(tipoSeleccionado)) {
      this.alertasService.error(
        'El tipo de usuario seleccionado ya está configurado.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
      return;
    }

    const nuevaConfig = {
      id_espacio: this.espaciosConfigService.espacioQuery.data()?.id || 0,
      tipo_usuario: tipoSeleccionado,
      porcentaje_descuento: this.porcentaje_descuento.value!,
      minutos_retraso: this.minutos_retraso.value!,
    };

    try {
      await this.espaciosConfigService.crearTipoUsuarioCofig(nuevaConfig);

      this.alertasService.success(
        'Configuración creada exitosamente.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );

      this.cancelarCreacion();
      this.espaciosConfigService.espacioQuery.refetch();
    } catch (error) {
      console.error('Error al crear configuración:', error);
      this.alertasService.error(
        'Error al crear el configuración. Por favor, inténtalo de nuevo.',
        5000,
        this.espaciosConfigService.alertaEspacioConfigRef()!,
        'fixed flex p-4 transition-all ease-in-out bottom-4 right-4',
      );
    }
  }
}
