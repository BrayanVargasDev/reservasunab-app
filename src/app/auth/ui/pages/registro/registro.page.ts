import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonRow,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  keyOutline,
  mailOutline,
  personOutline,
  phonePortraitOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrl: './registro.page.scss',
  standalone: true,
  imports: [
    IonIcon,
    IonText,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    addIcons({
      mailOutline,
      keyOutline,
      personOutline,
      phonePortraitOutline,
    });
  }

  ngOnInit() {
    this.registroForm = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  onRegistro() {
    if (this.registroForm.valid) {
      console.log('Datos de registro válidos:', this.registroForm.value);
      // Aquí iría la lógica para registrar al usuario
    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched();
    }
  }
}
