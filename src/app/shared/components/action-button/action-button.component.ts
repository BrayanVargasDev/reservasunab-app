import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonText]
})
export class ActionButtonComponent {
  @Input() texto: string = 'Aceptar';
  @Input() color: string = 'primary';
  @Input() expand: 'block' | 'full' | undefined = 'block';
  @Input() tipo: 'submit' | 'button' | 'reset' = 'button';
  @Input() icono: string | null = null;
  @Input() iconoSlot: 'start' | 'end' = 'end';
  @Input() disabled: boolean = false;
  @Input() tamaño: 'small' | 'default' | 'large' = 'default';
  @Input() fill: 'solid' | 'clear' | 'outline' = 'solid';
  @Input() classList: string = '';
  @Input() textoClase: string = '';

  @Output() accionClick = new EventEmitter<Event>();

  constructor() {
    addIcons({
      arrowForwardOutline
    });
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.accionClick.emit(event);
    }
  }

  get sizeValue(): string | undefined {
    if (this.tamaño === 'small') return 'small';
    if (this.tamaño === 'large') return 'large';
    return undefined;
  }
}
