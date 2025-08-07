import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tratamiento-datos',
  imports: [CommonModule],
  templateUrl: './tratamiento-datos.component.html',
  styleUrl: './tratamiento-datos.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TratamientoDatosComponent { }
