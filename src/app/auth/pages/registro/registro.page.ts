import {
  Component,
  OnInit,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
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
import { RouterLink, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  keyOutline,
  mailOutline,
  personOutline,
  phonePortraitOutline,
} from 'ionicons/icons';
import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { AuthService } from '@auth/services/auth.service';
import { Registro } from '@auth/interfaces';
import { AlertasService } from '@shared/services/alertas.service';

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
    WebIconComponent,
  ],
})
export class RegistroPage implements OnInit {
  private router = inject(Router);
  private estilosAlerta = signal(
    'flex justify-center p-4 transition-all ease-in-out w-full',
  ).asReadonly();
  public registroForm!: FormGroup;
  public formUtils = FormUtils;

  public appService = inject(AppService);
  public authService = inject(AuthService);
  public alertaService = inject(AlertasService);

  public alertaRegistro = viewChild.required('alertaRegistro', {
    read: ViewContainerRef,
  });

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
        nombre: [
          '',
          [Validators.required, Validators.pattern(FormUtils.patronNombre)],
        ],
        telefono: [
          '',
          [
            Validators.required,
            Validators.pattern(FormUtils.patronSoloNumeros),
            Validators.pattern(FormUtils.patronCelular),
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          [FormUtils.validarRespuestaServidor],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(FormUtils.patronContrasena),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [FormUtils.sonCamposIguales('password', 'confirmPassword')],
      },
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    return !!this.formUtils.esCampoInvalido(this.registroForm, fieldName);
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

  isConfirmPasswordInvalid(): boolean {
    return (
      this.isFieldInvalid('confirmPassword') ||
      this.registroForm.hasError('camposNoIguales')
    );
  }

  isConfirmPasswordValid(): boolean {
    const control = this.registroForm.get('confirmPassword');
    return (
      control !== null &&
      control.valid &&
      control.touched &&
      !this.registroForm.hasError('camposNoIguales')
    );
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

  getErrorMessage(fieldName: string): string[] {
    const messages: string[] = [];

    const errorMessage = this.formUtils.obtenerErrorDelCampo(
      this.registroForm,
      fieldName,
    );
    if (errorMessage) {
      messages.push(errorMessage);
    }

    if (
      fieldName === 'confirmPassword' &&
      this.registroForm.hasError('camposNoIguales')
    ) {
      messages.push('Las contraseñas no coinciden');
    }

    return messages;
  }

  onRegistro() {
    this.registroForm.markAllAsTouched();
    if (this.registroForm.invalid) {
      return;
    }

    const nombre = this.registroForm.get('nombre')?.value.trim().split(' ');

    if (nombre.length < 2) {
      this.alertaService.error(
        'Debe ingresar al menos un nombre y un apellido.',
        5000,
        this.alertaRegistro(),
        this.estilosAlerta(),
      );
      return;
    }

    const formData: Registro = {
      nombre: nombre[0]?.charAt(0).toUpperCase() + nombre[0]?.slice(1) || '',
      apellido: nombre[1]?.charAt(0).toUpperCase() + nombre[1]?.slice(1) || '',
      celular: this.registroForm.get('telefono')?.value.trim(),
      email: this.registroForm.get('email')?.value.trim(),
      password: this.registroForm.get('password')?.value.trim(),
    };

    this.authService.registro(formData).then(
      response => {
        this.alertaService.success(
          'Registro exitoso. Por favor, inicia sesión.',
          3000,
          this.alertaRegistro(),
          this.estilosAlerta(),
        );
        this.registroForm.reset();
      },
      error => {
        console.error('Error en el registro:', error);
        this.alertaService.error(
          'Error al registrar usuario. Inténtalo de nuevo más tarde.',
          5000,
          this.alertaRegistro(),
          this.estilosAlerta(),
        );
      },
    );
  }
}
