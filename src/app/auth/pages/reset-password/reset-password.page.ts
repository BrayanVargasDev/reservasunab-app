import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
  IonIcon,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, checkmarkCircle } from 'ionicons/icons';
import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonItem,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    ActionButtonComponent,
  ],
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;
  emailEnviado = false;

  constructor(private fb: FormBuilder) {
    addIcons({mailOutline, checkmarkCircle});
  }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Métodos para controlar las validaciones
  isFieldInvalid(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    return control !== null && control.invalid && control.touched;
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.resetForm.get(fieldName);
    return control !== null && control.valid && control.touched;
  }

  getFieldClass(fieldName: string): { [key: string]: boolean } {
    return {
      'input-valid': this.isFieldValid(fieldName),
      'input-invalid': this.isFieldInvalid(fieldName),
    };
  }

  getIconColor(fieldName: string): string {
    if (this.isFieldInvalid(fieldName)) return 'danger';
    if (this.isFieldValid(fieldName)) return 'success';
    return 'dark';
  }

  // Obtener mensajes de error
  getErrorMessage(fieldName: string): string[] {
    const messages: string[] = [];
    const control = this.resetForm.get(fieldName);

    if (control?.errors) {
      const customErrors: { [key: string]: string } = {
        required: 'El correo electrónico es obligatorio',
        email: 'El formato del correo no es válido',
      };

      for (const key of Object.keys(control.errors)) {
        if (key in customErrors) {
          messages.push(customErrors[key]);
        }
      }
    }

    return messages;
  }

  onReset() {
    if (this.resetForm.valid) {
      console.log(
        'Solicitud de restablecimiento para:',
        this.resetForm.value.email,
      );
      // Aquí iría la lógica para enviar el correo de restablecimiento
      this.emailEnviado = true;
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
