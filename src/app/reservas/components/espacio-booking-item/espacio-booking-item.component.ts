import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@environments/environment';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'espacio-booking-item',
  imports: [CommonModule, WebIconComponent],
  templateUrl: './espacio-booking-item.component.html',
  styleUrl: './espacio-booking-item.component.scss',
})
export class EspacioBookingItemComponent {
  imagenUrl = input<string>();
  calificacion = input<number>();
  ubicacion = input<string>();
  titulo = input<string>();
  env = environment;

  abrirEspacioEvent = output();

  public abrirEspacio() {
    this.abrirEspacioEvent.emit();
  }
}
