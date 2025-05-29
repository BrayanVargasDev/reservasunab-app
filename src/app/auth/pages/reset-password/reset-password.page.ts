import { Component, OnInit, inject } from '@angular/core';
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
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from '../../../shared/components/web-icon/web-icon.component';

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
    WebIconComponent,
  ],
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;
  emailEnviado = false;
  formUtils = FormUtils;

  appService = inject(AppService);
  fb = inject(FormBuilder);

  ngOnInit() {
    addIcons({ mailOutline, checkmarkCircle });
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Métodos para controlar las validaciones
  isFieldInvalid(fieldName: string): boolean {
    return this.formUtils.esCampoValido(this.resetForm, fieldName) ?? true;
  }

  isFieldValid(fieldName: string): boolean {
    return this.formUtils.esCampoValido(this.resetForm, fieldName) ?? false;
  }

  getFieldClass(fieldName: string): { [key: string]: boolean } {
    return {
      'input-valid':
        this.formUtils.esCampoValido(this.resetForm, fieldName) ?? false,
      'input-invalid':
        this.formUtils.esCampoValido(this.resetForm, fieldName) ?? false,
    };
  }

  getIconColor(fieldName: string): string {
    if (this.formUtils.esCampoValido(this.resetForm, fieldName))
      return 'danger';
    if (this.formUtils.esCampoValido(this.resetForm, fieldName))
      return 'success';
    return 'dark';
  }

  // Obtener mensajes de error usando FormUtils
  getErrorMessage(fieldName: string): string[] {
    const messages: string[] = [];

    const errorMessage = this.formUtils.obtenerErrorDelCampo(
      this.resetForm,
      fieldName,
    );
    if (errorMessage) {
      messages.push(errorMessage);
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
