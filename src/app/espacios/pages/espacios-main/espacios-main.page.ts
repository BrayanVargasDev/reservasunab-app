import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-espacios-main',
  templateUrl: './espacios-main.page.html',
  styleUrls: ['./espacios-main.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EspaciosMainPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
