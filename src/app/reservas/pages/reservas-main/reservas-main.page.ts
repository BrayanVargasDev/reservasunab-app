import {
  Component,
  OnInit,
  signal,
  effect,
  viewChild,
  ElementRef,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservas-main',
  templateUrl: './reservas-main.page.html',
  styleUrls: ['./reservas-main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export default class ReservasMainPage {}
