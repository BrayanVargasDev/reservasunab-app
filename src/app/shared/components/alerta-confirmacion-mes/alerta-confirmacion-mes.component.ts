import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  HostBinding,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { WebIconComponent } from '../web-icon/web-icon.component';
import { i18nDatePicker } from '@shared/constants/lenguaje.constant';

export interface ConfiguracionBoton {
  texto: string;
  estilo?: string;
  tipo: 'confirmar' | 'cancelar';
}

export type TipoAlertaConfirmacion =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'question';

export type PosicionAlerta =
  | 'centro'
  | 'arriba-derecha'
  | 'arriba-izquierda'
  | 'abajo-derecha'
  | 'abajo-izquierda'
  | 'arriba-centro'
  | 'abajo-centro';

@Component({
  selector: 'app-alerta-confirmacion-mes',
  imports: [CommonModule, WebIconComponent, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-xs animate-[fade_in_0.3s_ease-out]"
      [ngClass]="clasesPosicion()"
      (click)="cerrarAlerta()"
    >
      <div
        class="bg-white rounded-box shadow-xl p-6 max-w-md w-full m-4 animate-[slide_in_0.3s_ease-out] relative"
        [ngClass]="clasesContenedor()"
        (click)="$event.stopPropagation()"
      >
        <!-- Icono y contenido principal -->
        <div class="flex items-start gap-4 mb-6">
          <div
            class="shrink-0 w-12 h-12 rounded-full flex items-center content-center mr-2 pointer-events-none !p-0"
            [ngClass]="clasesIcono()"
          >
            <app-web-icon
              [nombreIcono]="obtenerNombreIcono()"
              [estilos]="'h-8 w-8 p-0 pointer-events-none'"
            ></app-web-icon>
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold mb-1" [ngClass]="clasesTitulo()">
              {{ titulo() }}
            </h3>
            <p
              class="text-sm m-0 text-base-300"
              [ngClass]="clasesMensaje()"
              [innerHTML]="mensaje()"
            ></p>
          </div>
        </div>

        <!-- Select de mes -->
        <div class="mb-6">
          <label
            class="label text-sm font-semibold text-base-content mb-2 block"
          >
            Seleccionar Mes:
          </label>
          <select
            [formControl]="mesSeleccionadoControl"
            class="select select-bordered select-sm w-full rounded-md pl-1"
          >
            @for (mes of meses; track $index) {
            <option [value]="$index + 1">
              {{ mes }}
            </option>
            }
          </select>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-3 content-end mt-6" [ngClass]="clasesAcciones()">
          @for (boton of botones(); track trackByBoton($index, boton)) {
          <button
            type="button"
            class="relative border-none text-md transition-all duration-300 ease-in-out"
            [ngClass]="obtenerEstilosBoton(boton)"
            (click)="ejecutarAccion(boton.tipo)"
          >
            {{ boton.texto }}
          </button>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./alerta-confirmacion-mes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertaConfirmacionMesComponent {
  // Inputs
  tipo = input<TipoAlertaConfirmacion>('question');
  titulo = input<string>('Confirmación');
  mensaje = input<string>('¿Estás seguro de que quieres continuar?');
  posicion = input<PosicionAlerta>('centro');
  botones = input<ConfiguracionBoton[]>([
    { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
    { texto: 'Confirmar', tipo: 'confirmar', estilo: 'btn-primary' },
  ]);
  estilosPersonalizados = input<string>('');
  mostrarIcono = input<boolean>(true);
  anchuraMaxima = input<string>('28rem');

  // Outputs
  confirmado = output<{ confirmado: boolean; mes: number }>();
  cerrado = output<void>();

  // Señales internas
  private cerrandose = signal(false);

  // FormControl para el select de mes
  public mesSeleccionadoControl = new FormControl<number>(
    new Date().getMonth() + 1,
  );

  // Meses del año
  public meses = i18nDatePicker.months;

  @HostBinding('class')
  get cssClass() {
    return `fixed top-0 left-0 right-0 bottom-0 z-[9999] ${this.estilosPersonalizados()}`;
  }

  // Computed para clases CSS
  clasesPosicion = computed(() => {
    const posicionesMap: Record<PosicionAlerta, string> = {
      centro: 'items-center justify-center',
      'arriba-derecha': 'items-start justify-end pt-4 pr-4',
      'arriba-izquierda': 'items-start justify-start pt-4 pl-4',
      'abajo-derecha': 'items-end justify-end pb-4 pr-4',
      'abajo-izquierda': 'items-end justify-start pb-4 pl-4',
      'arriba-centro': 'items-start justify-center pt-4',
      'abajo-centro': 'items-end justify-center pb-4',
    };

    return `fixed inset-0 z-[9999] flex ${
      posicionesMap[this.posicion()]
    } backdrop-blur-sm bg-black/50 transition-all duration-300`;
  });

  clasesContenedor = computed(() => {
    const tipoClases: Record<TipoAlertaConfirmacion, string> = {
      success: 'border-l-4 border-[var(--color-success)]',
      error: 'border-l-4 border-[var(--color-error)]',
      warning: 'border-l-4 border-[var(--color-warning)]',
      info: 'border-l-4 border-[var(--color-info)]',
      question: 'border-l-4 border-[var(--color-secondary)]',
    };

    return `bg-white rounded-lg shadow-xl p-6 max-w-[${this.anchuraMaxima()}] w-full mx-4 ${
      tipoClases[this.tipo()]
    } animate-in fade-in zoom-in duration-300`;
  });

  clasesIcono = computed(() => {
    const tipoColores: Record<TipoAlertaConfirmacion, string> = {
      success: 'btn btn-soft btn-success',
      error: 'btn btn-soft btn-error',
      warning: 'btn btn-soft btn-warning',
      info: 'btn btn-soft btn-info',
      question: 'btn btn-soft btn-secondary',
    };

    return `flex items-center justify-center w-12 h-12 rounded-full ${
      tipoColores[this.tipo()]
    }`;
  });

  clasesTitulo = computed(() => {
    const tipoColores: Record<TipoAlertaConfirmacion, string> = {
      success: 'text-[var(--color-success)]',
      error: 'text-[var(--color-error)]',
      warning: 'text-[var(--color-warning)]',
      info: 'text-[var(--color-info)]',
      question: 'text-[var(--color-secondary)]',
    };

    return `text-lg font-semibold ${tipoColores[this.tipo()]}`;
  });

  clasesMensaje = computed(() => {
    return 'text-base-content mt-1';
  });

  clasesAcciones = computed(() => {
    return 'flex gap-3 justify-end mt-6';
  });

  obtenerNombreIcono = computed(() => {
    const iconos: Record<TipoAlertaConfirmacion, string> = {
      success: 'checkmark-circle-outline',
      error: 'close-circle-outline',
      warning: 'warning-outline',
      info: 'information-circle-outline',
      question: 'help-circle-outline',
    };

    return iconos[this.tipo()];
  });

  obtenerEstilosBoton(boton: ConfiguracionBoton): string {
    const estilosBase = 'btn btn-sm';

    if (boton.estilo) {
      return `${estilosBase} ${boton.estilo} ${
        boton.estilo.includes('btn-ghost') ? '' : 'btn-soft'
      }`;
    }

    // Estilos por defecto según el tipo
    const estilosPorDefecto = {
      cancelar: 'btn-ghost',
      confirmar: this.obtenerEstiloConfirmar(),
    };

    return `${estilosBase} ${estilosPorDefecto[boton.tipo]}`;
  }

  private obtenerEstiloConfirmar(): string {
    const estilos: Record<TipoAlertaConfirmacion, string> = {
      success: 'btn-soft btn-success',
      error: 'btn-soft btn-error',
      warning: 'btn-soft btn-waring',
      info: 'btn-soft btn-info',
      question: 'btn-soft btn-secondary',
    };

    return estilos[this.tipo()];
  }

  trackByBoton(index: number, boton: ConfiguracionBoton): string {
    return `${boton.tipo}-${boton.texto}`;
  }

  ejecutarAccion(tipo: 'confirmar' | 'cancelar'): void {
    if (this.cerrandose()) return;

    this.cerrandose.set(true);

    if (tipo === 'confirmar') {
      this.confirmado.emit({
        confirmado: true,
        mes: this.mesSeleccionadoControl.value || 1,
      });
    } else {
      this.confirmado.emit({
        confirmado: false,
        mes: this.mesSeleccionadoControl.value || 1,
      });
    }

    this.cerrado.emit();
  }

  cerrarAlerta(): void {
    this.ejecutarAccion('cancelar');
  }
}
