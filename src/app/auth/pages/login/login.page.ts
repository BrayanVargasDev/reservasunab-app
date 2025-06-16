import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
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
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { AuthService } from '@auth/services/auth.service';
import { AlertasService } from '@shared/services/alertas.service';

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
  private alertaService = inject(AlertasService);
  public appService = inject(AppService);
  public authService = inject(AuthService);

  public formUtils = FormUtils;
  public loginForm: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  public alertaLogin = viewChild.required('alertaLogin', {
    read: ViewContainerRef,
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
    // window.location.href = samlUrl;
  }

  disableForm() {
    this.loginForm.disable();
  }

  onLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.loginForm.enable();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.setLoading(true);
    this.authService
      .login(email, password)
      .then(() => {
        this.authService.setLoading(false);
      })
      .catch(error => {
        this.authService.setLoading(false);
        this.loginForm.enable();
        this.alertaService.error(
          `Error al iniciar sesión ${
            error || ' inténtelo de nuevo más tarde.'
          }`,
          5000,
          this.alertaLogin(),
        );
      });
  }
}
