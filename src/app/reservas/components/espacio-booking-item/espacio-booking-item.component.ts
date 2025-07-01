import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-espacio-booking-item',
  imports: [CommonModule],
  templateUrl: './espacio-booking-item.component.html',
  styleUrl: './espacio-booking-item.component.scss',
})
export class EspacioBookingItemComponent {
  imagenUrl = input<string>();
  calificacion = input<number>();
  ubicacion = input<string>();
  titulo = input<string>();
}
