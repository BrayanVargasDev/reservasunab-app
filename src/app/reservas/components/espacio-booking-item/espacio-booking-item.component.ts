import { Component, input, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { environment } from '@environments/environment';

@Component({
  selector: 'espacio-booking-item',
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './espacio-booking-item.component.html',
  styleUrl: './espacio-booking-item.component.scss',
})
export class EspacioBookingItemComponent {
  imagenUrl = input<string>();
  calificacion = input<number>();
  ubicacion = input<string>();
  titulo = input<string>();
  env = environment;
}
