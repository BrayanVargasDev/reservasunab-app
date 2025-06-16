import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
  input,
  HostBinding,
} from '@angular/core';
import { AlertasService, Alerta } from '../../services/alertas.service';
import { CommonModule } from '@angular/common';
import { WebIconComponent } from '../web-icon/web-icon.component';
import { computed } from '@angular/core';

@Component({
  selector: 'app-alerta',
  imports: [CommonModule, WebIconComponent],
  template: `
    <div
      role="alert"
      [ngClass]="{
        alert: true,
        'alert-success': tipo() === 'success',
        'alert-error': tipo() === 'error',
        'alert-info': tipo() === 'info',
        'alert-warning': tipo() === 'warning',
        'shadow-lg': true,
        'max-w-md': true,
      }"
    >
      <app-web-icon
        [nombreIcono]="obtenerNombreIcono()"
        estilos="h-5 w-5"
      ></app-web-icon>
      <span [innerHTML]="mensaje()"></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertaComponent {
  alertaService = inject(AlertasService);
  tipo = input<string>('info');
  mensaje = input<string>('');
  estilos = input<string>(
    'fixed top-0 right-0 z-[1000] flex justify-center p-4 transition-all ease-in-out',
  );

  @HostBinding('class')
  get cssClass() {
    return this.estilos();
  }

  obtenerNombreIcono = computed(() => {
    const nombres: { [key: string]: string } = {
      success: 'checkmark-circle-outline',
      error: 'close-circle-outline',
      info: 'warning-circle-outline',
      warning: 'warning-outline',
    };

    return nombres[this.tipo() || 'info'];
  });
}
