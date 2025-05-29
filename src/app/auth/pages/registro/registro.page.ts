import { Component, OnInit, inject } from '@angular/core';
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
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from "../../../shared/components/web-icon/web-icon.component";

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
    WebIconComponent
],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup;
  formUtils = FormUtils;

  appService = inject(AppService);

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
        validators: [FormUtils.sonCamposIguales('password', 'confirmPassword')],
      },
    );
  }

  // Métodos para controlar las validaciones usando FormUtils
  isFieldInvalid(fieldName: string): boolean {
    return !!this.formUtils.esCampoValido(this.registroForm, fieldName);
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
    return this.isFieldInvalid('confirmPassword') ||
           this.registroForm.hasError('camposNoIguales');
  }

  isConfirmPasswordValid(): boolean {
    const control = this.registroForm.get('confirmPassword');
    return control !== null && control.valid && control.touched &&
           !this.registroForm.hasError('camposNoIguales');
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

  // Obtener mensajes de error usando FormUtils
  getErrorMessage(fieldName: string): string[] {
    const messages: string[] = [];

    // Usar FormUtils para obtener el mensaje de error principal
    const errorMessage = this.formUtils.obtenerErrorDelCampo(this.registroForm, fieldName);
    if (errorMessage) {
      messages.push(errorMessage);
    }

    // Manejar el caso especial de confirmPassword
    if (fieldName === 'confirmPassword' && this.registroForm.hasError('camposNoIguales')) {
      messages.push('Las contraseñas no coinciden');
    }

    return messages;
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
