import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pago-info-item',
  imports: [CommonModule],
  templateUrl: './pago-info-item.component.html',
  styleUrl: './pago-info-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 p-6 md:p-4 rounded-xl shadow-lg w-full',
  },
})
export class PagoInfoItemComponent {
  title = input.required<string>();
  items = input.required<{ label: string; value: string; class?: string }[]>();
}
