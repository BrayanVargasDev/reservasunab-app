import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
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
import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';

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
    ActionButtonComponent,
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

  // Validador personalizado para verificar que las contraseñas coinciden
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  // Métodos para controlar las validaciones
  isFieldInvalid(fieldName: string): boolean {
    const control = this.registroForm.get(fieldName);
    return control !== null && control.invalid && control.touched;
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.registroForm.get(fieldName);
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

  // Método específico para confirmar contraseña
  isConfirmPasswordInvalid(): boolean {
    const confirmControl = this.registroForm.get('confirmPassword');
    return (confirmControl?.touched && confirmControl?.invalid) ||
           (confirmControl?.touched && this.registroForm.hasError('passwordMismatch'));
  }

  isConfirmPasswordValid(): boolean {
    const confirmControl = this.registroForm.get('confirmPassword');
    return confirmControl?.touched && confirmControl?.valid && !this.registroForm.hasError('passwordMismatch');
  }

  getConfirmPasswordClass(): { [key: string]: boolean } {
    return {
      'input-valid': this.isConfirmPasswordValid(),
      'input-invalid': this.isConfirmPasswordInvalid(),
    };
  }

  getConfirmPasswordIconColor(): string {
    if (this.isConfirmPasswordInvalid()) return 'danger';
    if (this.isConfirmPasswordValid()) return 'success';
    return 'dark';
  }

  // Obtener mensajes de error
  getErrorMessage(fieldName: string): string[] {
    const messages: string[] = [];
    const control = this.registroForm.get(fieldName);

    if (control?.errors) {
      const customErrors: { [key: string]: string } = {
        required: `El ${this.getFieldLabel(fieldName)} es obligatorio`,
        email: 'El formato del correo no es válido',
        minlength: `La ${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength']?.requiredLength} caracteres`,
      };

      for (const key of Object.keys(control.errors)) {
        if (key in customErrors) {
          messages.push(customErrors[key]);
        }
      }
    }

    if (fieldName === 'confirmPassword' && this.registroForm.hasError('passwordMismatch')) {
      messages.push('Las contraseñas no coinciden');
    }

    return messages;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'nombre',
      telefono: 'teléfono',
      email: 'correo',
      password: 'contraseña',
      confirmPassword: 'confirmación de contraseña',
    };
    return labels[fieldName] || fieldName;
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
