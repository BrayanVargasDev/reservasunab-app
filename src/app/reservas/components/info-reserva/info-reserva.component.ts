import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ResumenReserva } from '../../interfaces/resumen-reserva.interface';
import { CommonModule } from '@angular/common';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { UpperFirstPipe } from '@shared/pipes';

@Component({
  selector: 'dreservas-info-reserva',
  imports: [CommonModule, WebIconComponent, UpperFirstPipe],
  templateUrl: './info-reserva.component.html',
  styleUrl: './info-reserva.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: {
    class: 'bg-base-200 rounded-lg p-6 mb-4',
  },
})
export class InfoReservaComponent {
  resumen = input<ResumenReserva | null>();
}
