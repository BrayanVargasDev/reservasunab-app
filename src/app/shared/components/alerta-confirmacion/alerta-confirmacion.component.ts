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
import { WebIconComponent } from '../web-icon/web-icon.component';

export interface ConfiguracionBoton {
  texto: string;
  estilo?: string;
  tipo: 'confirmar' | 'cancelar';
}

export type TipoAlertaConfirmacion = 'success' | 'error' | 'info' | 'warning' | 'question';
export type PosicionAlerta = 'centro' | 'arriba-derecha' | 'arriba-izquierda' | 'abajo-derecha' | 'abajo-izquierda' | 'arriba-centro' | 'abajo-centro';

@Component({
  selector: 'app-alerta-confirmacion',
  imports: [CommonModule, WebIconComponent],
  template: `
    <div class="alerta-overlay" [ngClass]="clasesPosicion()" (click)="cerrarAlerta()">
      <div 
        class="alerta-contenedor" 
        [ngClass]="clasesContenedor()"
        (click)="$event.stopPropagation()"
      >
        <!-- Icono y contenido principal -->
        <div class="alerta-header">
          <div class="alerta-icono" [ngClass]="clasesIcono()">
            <app-web-icon [nombreIcono]="obtenerNombreIcono()" [estilos]="'h-6 w-6'"></app-web-icon>
          </div>
          
          <div class="alerta-contenido">
            <h3 class="alerta-titulo" [ngClass]="clasesTitulo()">{{ titulo() }}</h3>
            <p class="alerta-mensaje" [ngClass]="clasesMensaje()">{{ mensaje() }}</p>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="alerta-acciones" [ngClass]="clasesAcciones()">
          <button
            *ngFor="let boton of botones(); trackBy: trackByBoton"
            type="button"
            class="alerta-boton"
            [ngClass]="obtenerEstilosBoton(boton)"
            (click)="ejecutarAccion(boton.tipo)"
          >
            {{ boton.texto }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./alerta-confirmacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertaConfirmacionComponent {
  // Inputs
  tipo = input<TipoAlertaConfirmacion>('question');
  titulo = input<string>('Confirmación');
  mensaje = input<string>('¿Estás seguro de que quieres continuar?');
  posicion = input<PosicionAlerta>('centro');
  botones = input<ConfiguracionBoton[]>([
    { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
    { texto: 'Confirmar', tipo: 'confirmar', estilo: 'btn-primary' }
  ]);
  estilosPersonalizados = input<string>('');
  mostrarIcono = input<boolean>(true);
  anchuraMaxima = input<string>('28rem');
  
  // Outputs
  confirmado = output<boolean>();
  cerrado = output<void>();

  // Señales internas
  private cerrandose = signal(false);

  @HostBinding('class')
  get cssClass() {
    return `alerta-confirmacion-wrapper ${this.estilosPersonalizados()}`;
  }

  // Computed para clases CSS
  clasesPosicion = computed(() => {
    const posicionesMap: Record<PosicionAlerta, string> = {
      'centro': 'items-center justify-center',
      'arriba-derecha': 'items-start justify-end pt-4 pr-4',
      'arriba-izquierda': 'items-start justify-start pt-4 pl-4',
      'abajo-derecha': 'items-end justify-end pb-4 pr-4',
      'abajo-izquierda': 'items-end justify-start pb-4 pl-4',
      'arriba-centro': 'items-start justify-center pt-4',
      'abajo-centro': 'items-end justify-center pb-4'
    };
    
    return `fixed inset-0 z-[9999] flex ${posicionesMap[this.posicion()]} backdrop-blur-sm bg-black/50 transition-all duration-300`;
  });

  clasesContenedor = computed(() => {
    const tipoClases: Record<TipoAlertaConfirmacion, string> = {
      'success': 'border-l-4 border-green-500',
      'error': 'border-l-4 border-red-500',
      'warning': 'border-l-4 border-yellow-500',
      'info': 'border-l-4 border-blue-500',
      'question': 'border-l-4 border-purple-500'
    };
    
    return `bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-[${this.anchuraMaxima()}] w-full mx-4 ${tipoClases[this.tipo()]} animate-in fade-in zoom-in duration-300`;
  });

  clasesIcono = computed(() => {
    const tipoColores: Record<TipoAlertaConfirmacion, string> = {
      'success': 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      'error': 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      'warning': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      'info': 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      'question': 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    };
    
    return `flex items-center justify-center w-12 h-12 rounded-full ${tipoColores[this.tipo()]}`;
  });

  clasesTitulo = computed(() => {
    const tipoColores: Record<TipoAlertaConfirmacion, string> = {
      'success': 'text-green-800 dark:text-green-200',
      'error': 'text-red-800 dark:text-red-200',
      'warning': 'text-yellow-800 dark:text-yellow-200',
      'info': 'text-blue-800 dark:text-blue-200',
      'question': 'text-purple-800 dark:text-purple-200'
    };
    
    return `text-lg font-semibold ${tipoColores[this.tipo()]}`;
  });

  clasesMensaje = computed(() => {
    return 'text-gray-600 dark:text-gray-300 mt-1';
  });

  clasesAcciones = computed(() => {
    return 'flex gap-3 justify-end mt-6';
  });

  obtenerNombreIcono = computed(() => {
    const iconos: Record<TipoAlertaConfirmacion, string> = {
      'success': 'checkmark-circle-outline',
      'error': 'close-circle-outline',
      'warning': 'warning-outline',
      'info': 'information-circle-outline',
      'question': 'help-circle-outline'
    };

    return iconos[this.tipo()];
  });

  obtenerEstilosBoton(boton: ConfiguracionBoton): string {
    const estilosBase = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (boton.estilo) {
      return `${estilosBase} ${boton.estilo}`;
    }
    
    // Estilos por defecto según el tipo
    const estilosPorDefecto = {
      'cancelar': 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      'confirmar': this.obtenerEstiloConfirmar()
    };
    
    return `${estilosBase} ${estilosPorDefecto[boton.tipo]}`;
  }

  private obtenerEstiloConfirmar(): string {
    const estilos: Record<TipoAlertaConfirmacion, string> = {
      'success': 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      'error': 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      'warning': 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
      'info': 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      'question': 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
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
      this.confirmado.emit(true);
    } else {
      this.confirmado.emit(false);
    }
    
    this.cerrado.emit();
  }

  cerrarAlerta(): void {
    this.ejecutarAccion('cancelar');
  }
}
