import { CommonModule } from '@angular/common';
import { Component, input, Output, EventEmitter, signal } from '@angular/core';
import { IonButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonText],
})
export class ActionButtonComponent {
  public texto = input<string>('Aceptar');
  public color = input<string>('primary');
  public expand = input<'block' | 'full' | undefined>('block');
  public tipo = input<'submit' | 'button' | 'reset'>('button');
  public icono = input<string | null>(null);
  public iconoSlot = input<'start' | 'end'>('end');
  public disabled = input<boolean>(false);
  public tamano = input<'small' | 'default' | 'large'>('default');
  public fill = input<'solid' | 'clear' | 'outline'>('solid');
  public textoClase = input<string>('');

  public accionClick = new EventEmitter<Event>();

  constructor() {
    addIcons({
      arrowForwardOutline,
    });
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.accionClick.emit(event);
    }
  }

  get sizeValue(): string | undefined {
    if (this.tamano() === 'small') return 'small';
    if (this.tamano() === 'large') return 'large';
    return undefined;
  }
}
