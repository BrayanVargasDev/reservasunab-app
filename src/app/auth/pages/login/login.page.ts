import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from "../../../shared/components/web-icon/web-icon.component";

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
    WebIconComponent
],
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  appService = inject(AppService);

  formUtils = FormUtils;
  loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    remember: [false],
  });

  showPassword = signal(false);

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
    console.log('Current showPassword value:', this.showPassword());
    this.showPassword.set(!this.showPassword());
    console.log('Updated showPassword value:', this.showPassword());
  }

  obtenerColorIcono(campo: string): string {
    return this.formUtils.esCampoValido(this.loginForm, campo)
      ? 'danger'
      : 'dark';
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
