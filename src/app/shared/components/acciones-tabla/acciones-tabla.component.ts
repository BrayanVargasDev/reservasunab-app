import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BotonAcciones } from '@shared/interfaces/boton-acciones.interface';
import { WebIconComponent } from '../web-icon/web-icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'acciones-tabla',
  imports: [CommonModule, WebIconComponent],
  templateUrl: './acciones-tabla.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesTablaComponent {
  acciones = input.required<BotonAcciones[]>();

  trackByIcono = (index: number, accion: BotonAcciones) => accion.icono;
}
