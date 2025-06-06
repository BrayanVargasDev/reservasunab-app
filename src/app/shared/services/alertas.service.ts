import {
  Injectable,
  signal,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import {
  AlertaConfirmacionComponent,
  ConfiguracionBoton,
  TipoAlertaConfirmacion,
  PosicionAlerta
} from '@shared/components/alerta-confirmacion/alerta-confirmacion.component';

export interface Alerta {
  tipo: 'success' | 'error' | 'info' | 'warning';
  mensaje: string;
  duracion?: number;
  referencia: ViewContainerRef;
  estilos?: string;
}

export interface ConfiguracionAlertaConfirmacion {
  tipo?: TipoAlertaConfirmacion;
  titulo?: string;
  mensaje: string;
  posicion?: PosicionAlerta;
  botones?: ConfiguracionBoton[];
  estilosPersonalizados?: string;
  mostrarIcono?: boolean;
  anchuraMaxima?: string;
  referencia: ViewContainerRef;
}

@Injectable({ providedIn: 'root' })
export class AlertasService {
  show(alert: Alerta): ComponentRef<AlertaComponent> {
    alert.referencia.clear();

    const alertRef = alert.referencia.createComponent(AlertaComponent);
    alertRef.setInput('mensaje', alert.mensaje);
    alertRef.setInput('tipo', alert.tipo);
    alertRef.setInput('estilos', alert.estilos);

    setTimeout(() => {
      alertRef.destroy();
    }, alert.duracion);

    return alertRef;
  }

  success(
    mensaje: string,
    duracion = 3000,
    referencia: ViewContainerRef,
    estilos?: string,
  ) {
    this.show({ tipo: 'success', mensaje, duracion, referencia, estilos });
  }

  error(
    mensaje: string,
    duracion = 3000,
    referencia: ViewContainerRef,
    estilos?: string,
  ) {
    this.show({ tipo: 'error', mensaje, duracion, referencia, estilos });
  }

  info(
    mensaje: string,
    duracion = 3000,
    referencia: ViewContainerRef,
    estilos?: string,
  ) {
    this.show({ tipo: 'info', mensaje, duracion, referencia, estilos });
  }

  warning(
    mensaje: string,
    duracion = 3000,
    referencia: ViewContainerRef,
    estilos?: string,
  ) {
    this.show({ tipo: 'warning', mensaje, duracion, referencia, estilos });
  }

  /**
   * Muestra una alerta de confirmación personalizable
   * @param config Configuración de la alerta de confirmación
   * @returns Promise que se resuelve con true si se confirma, false si se cancela
   */
  async confirmacion(config: ConfiguracionAlertaConfirmacion): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      config.referencia.clear();

      const alertRef = config.referencia.createComponent(AlertaConfirmacionComponent);

      // Configurar inputs
      alertRef.setInput('tipo', config.tipo || 'question');
      alertRef.setInput('titulo', config.titulo || 'Confirmación');
      alertRef.setInput('mensaje', config.mensaje);
      alertRef.setInput('posicion', config.posicion || 'centro');
      alertRef.setInput('botones', config.botones || [
        { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Confirmar', tipo: 'confirmar', estilo: 'btn-primary' }
      ]);
      alertRef.setInput('estilosPersonalizados', config.estilosPersonalizados || '');
      alertRef.setInput('mostrarIcono', config.mostrarIcono !== false);
      alertRef.setInput('anchuraMaxima', config.anchuraMaxima || '28rem');

      // Suscribirse a los outputs
      const confirmadoSubscription = alertRef.instance.confirmado.subscribe((confirmado: boolean) => {
        resolve(confirmado);
      });

      const cerradoSubscription = alertRef.instance.cerrado.subscribe(() => {
        setTimeout(() => {
          confirmadoSubscription.unsubscribe();
          cerradoSubscription.unsubscribe();
          alertRef.destroy();
        }, 300); // Delay para permitir animación de salida
      });
    });
  }

  /**
   * Métodos de conveniencia para diferentes tipos de confirmación
   */
  async confirmarEliminacion(
    mensaje: string = '¿Estás seguro de que quieres eliminar este elemento?',
    referencia: ViewContainerRef,
    titulo: string = 'Confirmar eliminación'
  ): Promise<boolean> {
    return this.confirmacion({
      tipo: 'error',
      titulo,
      mensaje,
      referencia,
      botones: [
        { texto: 'Cancelar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Eliminar', tipo: 'confirmar', estilo: 'bg-red-600 text-white hover:bg-red-700' }
      ]
    });
  }

  async confirmarGuardado(
    mensaje: string = '¿Quieres guardar los cambios?',
    referencia: ViewContainerRef,
    titulo: string = 'Guardar cambios'
  ): Promise<boolean> {
    return this.confirmacion({
      tipo: 'success',
      titulo,
      mensaje,
      referencia,
      botones: [
        { texto: 'No guardar', tipo: 'cancelar', estilo: 'btn-ghost' },
        { texto: 'Guardar', tipo: 'confirmar', estilo: 'bg-green-600 text-white hover:bg-green-700' }
      ]
    });
  }

  async confirmarAccion(
    mensaje: string,
    referencia: ViewContainerRef,
    titulo: string = 'Confirmar acción',
    tipo: TipoAlertaConfirmacion = 'question'
  ): Promise<boolean> {
    return this.confirmacion({
      tipo,
      titulo,
      mensaje,
      referencia
    });
  }
}
