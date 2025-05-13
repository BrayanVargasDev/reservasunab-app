import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  eyeOutline,
} from 'ionicons/icons';
import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';
import { LoginService } from '@auth/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonText,
    IonItem,
    IonInput,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
    ActionButtonComponent,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private loginService: LoginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    remember: [false],
  });

  showPassword = false;

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      keyOutline,
      eyeOffOutline,
      eyeOutline,
      arrowForwardOutline,
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  esCampoValido(campo: string): boolean | null {
    return (
      this.loginForm.controls[campo].errors &&
      this.loginForm.controls[campo].touched
    );
  }

  obtenerColorIcono(campo: string): string {
    return this.esCampoValido(campo) ? 'danger' : 'dark';
  }

  obtenerErrorDelCampo(campo: string): string | null {
    if (!this.loginForm.controls[campo].errors) {
      return null;
    }

    const errors = this.loginForm.controls[campo].errors || {};

    const customErrors: { [key: string]: string } = {
      required: 'Este campo es requerido',
      email: 'El formato del correo no es válido',
      minlength: `El campo debe tener al menos ${errors['minlength']?.requiredLength} caracteres`,
    };

    for (const key of Object.keys(errors)) {
      if (key in customErrors) {
        return customErrors[key];
      }
    }

    return null;
  }

  onLogin() {
    // if (this.loginForm.valid) {
    //   console.log('Intentando iniciar sesión con:', this.loginForm.value);
    //   // Aquí iría la lógica para autenticar al usuario
    // } else {
    //   this.loginForm.form.markAllAsTouched();
    // }
  }
}
