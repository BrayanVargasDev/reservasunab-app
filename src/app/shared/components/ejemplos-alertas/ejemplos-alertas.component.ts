import {
  Component,
  ChangeDetectionStrategy,
  inject,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasService } from '@shared/services/alertas.service';

@Component({
  selector: 'app-ejemplos-alertas',
  templateUrl: './ejemplos-alertas.component.html',
  styleUrls: ['./ejemplos-alertas.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EjemplosAlertasComponent {
  private alertasService = inject(AlertasService);

  public alertasEjemplo = viewChild.required('alertasEjemplo', {
    read: ViewContainerRef,
  });

  // Ejemplos de alertas de confirmación

  async mostrarConfirmacionBasica() {
    const resultado = await this.alertasService.confirmacion({
      tipo: 'question',
      titulo: 'Confirmación',
      mensaje: '¿Estás seguro de que quieres continuar con esta acción?',
      referencia: this.alertasEjemplo(),
      posicion: 'centro'
    });
    
    this.mostrarResultado(resultado, 'Confirmación básica');
  }

  async mostrarConfirmacionEliminacion() {
    const resultado = await this.alertasService.confirmarEliminacion(
      'Este elemento será eliminado permanentemente y no podrá recuperarse.',
      this.alertasEjemplo(),
      'Eliminar elemento'
    );
    
    this.mostrarResultado(resultado, 'Eliminación');
  }

  async mostrarConfirmacionGuardado() {
    const resultado = await this.alertasService.confirmarGuardado(
      'Los cambios realizados se guardarán permanentemente.',
      this.alertasEjemplo(),
      'Guardar cambios'
    );
    
    this.mostrarResultado(resultado, 'Guardado');
  }

  async mostrarAlertaPosicionPersonalizada() {
    const resultado = await this.alertasService.confirmacion({
      tipo: 'info',
      titulo: 'Notificación',
      mensaje: 'Esta alerta aparece en la esquina superior derecha.',
      referencia: this.alertasEjemplo(),
      posicion: 'arriba-derecha',
      anchuraMaxima: '20rem',
      botones: [
        { texto: 'Cerrar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Entendido', tipo: 'confirmar', estilo: 'btn-info' }
      ]
    });
    
    this.mostrarResultado(resultado, 'Posición personalizada');
  }

  async mostrarAlertaBotonesPersonalizados() {
    const resultado = await this.alertasService.confirmacion({
      tipo: 'warning',
      titulo: 'Acción Requerida',
      mensaje: 'Selecciona una de las siguientes opciones para continuar.',
      referencia: this.alertasEjemplo(),
      posicion: 'centro',
      botones: [
        { 
          texto: 'Cancelar', 
          tipo: 'cancelar', 
          estilo: 'bg-gray-500 text-white hover:bg-gray-600 px-6 py-2 rounded-full' 
        },
        { 
          texto: 'Continuar Más Tarde', 
          tipo: 'cancelar', 
          estilo: 'bg-yellow-500 text-white hover:bg-yellow-600 px-6 py-2 rounded-full' 
        },
        { 
          texto: 'Continuar Ahora', 
          tipo: 'confirmar', 
          estilo: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full' 
        }
      ],
      anchuraMaxima: '32rem'
    });
    
    this.mostrarResultado(resultado, 'Botones personalizados');
  }

  async mostrarTodosLosTipos() {
    const tipos: Array<{ tipo: any, titulo: string, mensaje: string }> = [
      {
        tipo: 'success',
        titulo: 'Operación Exitosa',
        mensaje: '¿Quieres continuar con la siguiente operación?'
      },
      {
        tipo: 'error',
        titulo: 'Error Detectado',
        mensaje: '¿Quieres intentar nuevamente?'
      },
      {
        tipo: 'warning',
        titulo: 'Advertencia',
        mensaje: '¿Estás seguro de que quieres proceder?'
      },
      {
        tipo: 'info',
        titulo: 'Información',
        mensaje: '¿Te gustaría obtener más detalles?'
      },
      {
        tipo: 'question',
        titulo: 'Pregunta',
        mensaje: '¿Cómo quieres proceder?'
      }
    ];

    for (const config of tipos) {
      const resultado = await this.alertasService.confirmacion({
        tipo: config.tipo,
        titulo: config.titulo,
        mensaje: config.mensaje,
        referencia: this.alertasEjemplo(),
        posicion: 'centro'
      });
      
      if (!resultado) {
        break; // Si el usuario cancela, detener la secuencia
      }
    }
  }

  // Ejemplos de alertas tradicionales mejoradas

  mostrarAlertaExito() {
    this.alertasService.success(
      'Operación completada exitosamente.',
      4000,
      this.alertasEjemplo(),
      'fixed flex p-4 transition-all ease-in-out bottom-4 right-4 z-50'
    );
  }

  mostrarAlertaError() {
    this.alertasService.error(
      'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
      5000,
      this.alertasEjemplo(),
      'fixed flex p-4 transition-all ease-in-out top-4 left-1/2 transform -translate-x-1/2 z-50'
    );
  }

  mostrarAlertaAdvertencia() {
    this.alertasService.warning(
      'Ten cuidado con esta acción. Puede tener consecuencias importantes.',
      4500,
      this.alertasEjemplo(),
      'fixed flex p-4 transition-all ease-in-out bottom-4 left-4 z-50'
    );
  }

  mostrarAlertaInfo() {
    this.alertasService.info(
      'Esta es información importante que debes tener en cuenta.',
      3500,
      this.alertasEjemplo(),
      'fixed flex p-4 transition-all ease-in-out top-4 right-4 z-50'
    );
  }

  // Método auxiliar para mostrar resultados
  private mostrarResultado(resultado: boolean, tipo: string) {
    const mensaje = resultado ? 
      `${tipo}: Usuario confirmó la acción` : 
      `${tipo}: Usuario canceló la acción`;
    
    const tipoAlerta = resultado ? 'success' : 'info';
    
    setTimeout(() => {
      if (tipoAlerta === 'success') {
        this.alertasService.success(mensaje, 3000, this.alertasEjemplo());
      } else {
        this.alertasService.info(mensaje, 3000, this.alertasEjemplo());
      }
    }, 300);
  }
}
