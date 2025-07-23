import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { mailOutline, checkmarkCircle } from 'ionicons/icons';
import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, WebIconComponent],
})
export class ResetPasswordPage implements OnInit {
  resetForm!: FormGroup;
  emailEnviado = false;
  formUtils = FormUtils;

  appService = inject(AppService);
  fb = inject(FormBuilder);

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Métodos para controlar las validaciones
  isFieldInvalid(fieldName: string): boolean {
    return this.formUtils.esCampoInvalido(this.resetForm, fieldName) ?? true;
  }

  isFieldValid(fieldName: string): boolean {
    return this.formUtils.esCampoInvalido(this.resetForm, fieldName) ?? false;
  }

  getFieldClass(fieldName: string): { [key: string]: boolean } {
    return {
      'input-valid':
        this.formUtils.esCampoInvalido(this.resetForm, fieldName) ?? false,
      'input-invalid':
        this.formUtils.esCampoInvalido(this.resetForm, fieldName) ?? false,
    };
  }

  getIconColor(fieldName: string): string {
    if (this.formUtils.esCampoInvalido(this.resetForm, fieldName))
      return 'danger';
    if (this.formUtils.esCampoInvalido(this.resetForm, fieldName))
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
      // Aquí iría la lógica para enviar el correo de restablecimiento
      this.emailEnviado = true;
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
