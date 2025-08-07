import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminos-condiciones',
  imports: [CommonModule],
  templateUrl: './terminos-condiciones.component.html',
  styleUrl: './terminos-condiciones.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminosCondicionesComponent { }
