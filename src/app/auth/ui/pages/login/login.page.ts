import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOffOutline,
  arrowForwardOutline,
  keyOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  standalone: true,
  imports: [
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
  ],
})
export class LoginPage implements OnInit {
  loginData = {
    email: '',
    password: '',
  };

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      keyOutline,
      eyeOffOutline,
      arrowForwardOutline,
    });
  }

  ngOnInit() {}

  onLogin() {
    console.log('Intentando iniciar sesión con:', this.loginData);
    // Aquí iría la lógica para autenticar al usuario
  }
}
