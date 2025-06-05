import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
import { AppService } from '@app/app.service';
import { WebIconComponent } from '../../../shared/components/web-icon/web-icon.component';
import { AuthService } from '@auth/services/auth.service';
import { environment } from '@environments/environment';

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
    WebIconComponent,
  ],
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private environment = environment;
  public appService = inject(AppService);
  public authService = inject(AuthService);

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
    this.showPassword.set(!this.showPassword());
  }

  obtenerColorIcono(campo: string): string {
    return this.formUtils.esCampoInvalido(this.loginForm, campo)
      ? 'danger'
      : 'dark';
  }

  loginSaml() {
    this.disableForm();
    this.authService.setLoading(true);
    const samlUrl = `${this.environment.samlUrl}/saml/${this.environment.tenantId}/login`;
    console.log('🚀 ✅ ~ LoginPage ~ loginSaml ~ samlUrl:', samlUrl);
    window.location.href = samlUrl;
  }

  disableForm() {
    this.loginForm.disable();
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Intentando iniciar sesión con:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
