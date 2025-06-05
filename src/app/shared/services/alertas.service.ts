import {
  Injectable,
  signal,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';

export interface Alerta {
  tipo: 'success' | 'error' | 'info' | 'warning';
  mensaje: string;
  duracion?: number;
  referencia: ViewContainerRef;
  estilos?: string;
}

@Injectable({ providedIn: 'root' })
export class AlertasService {
  show(alert: Alerta): ComponentRef<AlertaComponent> {
    console.log('Mostrando alerta:', alert.referencia);
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
}
