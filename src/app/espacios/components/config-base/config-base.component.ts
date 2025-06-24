import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';

import {
  FlexRenderDirective,
  type ColumnDef,
  flexRenderComponent,
  ExpandedState,
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  Row,
} from '@tanstack/angular-table';

import { ResponsiveTableDirective } from '@shared/directives/responsive-table.directive';
import { DiaConfig, Configuracion } from '@espacios/interfaces';
import { TableExpansorComponent } from '@shared/components/table-expansor/table-expansor.component';
import { AppService } from '@app/app.service';
import { ConfigBaseService } from '@espacios/services/config-base.service';
import { ConfiguracionFormComponent } from '../configuracion-form/configuracion-form.component';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';

@Component({
  selector: 'config-base',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ResponsiveTableDirective,
    FlexRenderDirective,
    TableExpansorComponent,
    ConfiguracionFormComponent,
  ],
  templateUrl: './config-base.component.html',
  styleUrl: './config-base.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigBaseComponent {
  private fb = inject(FormBuilder);
  private espacioConfigService = inject(EspaciosConfigService);
  private configuracionService = inject(ConfigBaseService);
  public appService = inject(AppService);

  readonly dias = signal<DiaConfig[]>([
    { nombre: 'Lunes', numero: 1 },
    { nombre: 'Martes', numero: 2 },
    { nombre: 'Miércoles', numero: 3 },
    { nombre: 'Jueves', numero: 4 },
    { nombre: 'Viernes', numero: 5 },
    { nombre: 'Sábado', numero: 6 },
    { nombre: 'Domingo', numero: 7 },
    { nombre: 'Festivos', numero: 8 },
  ]);

  // Configuraciones cargadas desde el servidor
  public configuracionesFromQuery = computed(
    () => this.configuracionService.configsQuery.data() || [],
  );

  public formPorDia: FormGroup[] = [];
  public configuracionesGuardando = signal<Set<number>>(new Set());

  constructor() {
    // Inicializar formularios inmediatamente con valores por defecto
    this.inicializarFormulariosVacios();

    // Actualizar formularios cuando cambien las configuraciones del servidor
    effect(() => {
      const configuraciones = this.configuracionesFromQuery();
      if (configuraciones.length > 0) {
        this.actualizarFormulariosConDatos(configuraciones);
      }
    });
  }

  private inicializarFormulariosVacios() {
    this.formPorDia = this.dias().map(dia => {
      const form = this.fb.group({
        id: [null],
        dia_semana: [dia.numero],
        minutos_uso: [60],
        dias_previos_apertura: [3],
        hora_apertura: ['08:00'],
        tiempo_cancelacion: [60],
        franjas_horarias: this.fb.array([]),
      });

      return form;
    });
  }

  private actualizarFormulariosConDatos(configuraciones: Configuracion[]) {
    this.formPorDia.forEach(form => {
      const diaNumero = form.get('dia_semana')?.value;
      const configExistente = configuraciones.find(
        config => config.dia_semana === diaNumero,
      );

      if (configExistente) {
        form.patchValue({
          id: configExistente.id,
          minutos_uso: configExistente.minutos_uso,
          dias_previos_apertura: configExistente.dias_previos_apertura,
          hora_apertura: configExistente.hora_apertura,
          tiempo_cancelacion: configExistente.tiempo_cancelacion,
        });

        const franjasArray = form.get('franjas_horarias') as FormArray;
        franjasArray.clear();

        if (configExistente.franjas_horarias?.length) {
          configExistente.franjas_horarias.forEach(franja => {
            const franjaForm = this.fb.group({
              id: [franja.id],
              hora_inicio: [franja.hora_inicio],
              hora_fin: [franja.hora_fin],
              valor: [franja.valor],
              activa: [franja.activa],
            });
            franjasArray.push(franjaForm);
          });
        }
      }
    });
  }

  public columnasPorDefecto = signal<ColumnDef<DiaConfig>[]>([
    {
      id: 'expansor',
      header: '',
      size: 55,
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
      header: 'No. Día',
      accessorKey: 'numero',
      cell: info => info.getValue(),
    },
    {
      header: 'Nombre',
      accessorKey: 'nombre',
      cell: info => info.getValue(),
    },
    {
      id: 'estado',
      header: 'Estado',
      size: 120,
      cell: context => {
        const dia = context.row.original.numero;

        if (this.formPorDia.length === 0) {
          return '<span class="badge badge-ghost">Cargando...</span>';
        }

        const tieneConfig = this.tieneConfiguracionGuardada(dia);
        const estaGuardando = this.estaGuardando(dia);

        if (estaGuardando) {
          return '<span class="badge badge-warning">Guardando...</span>';
        }

        return tieneConfig
          ? '<span class="badge badge-success">Configurado</span>'
          : '<span class="badge badge-ghost">Sin configurar</span>';
      },
    },
  ]);

  public tableState = signal({
    expanded: {} as ExpandedState,
    globalFilter: '',
  });

  readonly tablaConfigs = createAngularTable(() => ({
    data: this.dias(),
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

  public onToggleRow(row: Row<DiaConfig>, editing = false) {
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

  public getFormPorDia(dia: number): FormGroup {
    const form = this.formPorDia.find(
      form => form.get('dia_semana')?.value === dia,
    );
    if (!form) {
      throw new Error(`No se encontró formulario para el día ${dia}`);
    }
    return form;
  }

  public getFormPorDiaSafe(dia: number): FormGroup | null {
    if (this.formPorDia.length === 0) {
      return null;
    }
    return (
      this.formPorDia.find(form => form.get('dia_semana')?.value === dia) ||
      null
    );
  }

  public getFranjasFormArray(dia: number): FormArray {
    return this.getFormPorDia(dia).get('franjas_horarias') as FormArray;
  }

  public agregarFranja(dia: number, franja: any) {
    const franjasArray = this.getFranjasFormArray(dia);
    const nuevaFranja = this.fb.group({
      hora_inicio: [franja.hora_inicio],
      hora_fin: [franja.hora_fin],
      valor: [franja.valor],
      activa: [true],
    });
    franjasArray.push(nuevaFranja);
  }

  public eliminarFranja(dia: number, index: number) {
    const franjasArray = this.getFranjasFormArray(dia);
    franjasArray.removeAt(index);
  }

  public obtenerConfiguracionCompleta(): any[] {
    return this.formPorDia.map(form => ({
      ...form.value,
      franjas_horarias: form.get('franjas_horarias')?.value || [],
    }));
  }

  public validarConfiguraciones(): boolean {
    return this.formPorDia.every(form => form.valid);
  }

  public async guardarConfiguracion(dia: number) {
    const form = this.getFormPorDia(dia);
    if (!form.valid) {
      console.warn('Formulario inválido para el día', dia);
      return;
    }

    this.configuracionesGuardando.update(set => new Set(set).add(dia));

    try {
      const configuracion: Configuracion = {
        ...form.value,
        id_espacio: this.espacioConfigService.idEspacio(),
        franjas_horarias: form.get('franjas_horarias')?.value || [],
      };

      await this.configuracionService.saveConfigMutation.mutateAsync(
        configuracion,
      );

    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      this.configuracionesGuardando.update(set => {
        const newSet = new Set(set);
        newSet.delete(dia);
        return newSet;
      });
    }
  }

  public estaGuardando(dia: number): boolean {
    return this.configuracionesGuardando().has(dia);
  }

  public tieneConfiguracionGuardada(dia: number): boolean {
    const configuraciones = this.configuracionesFromQuery();
    return configuraciones.some(config => config.dia_semana === dia);
  }
}
