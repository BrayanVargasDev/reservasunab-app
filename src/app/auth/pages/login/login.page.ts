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
import { HttpErrorResponse } from '@angular/common/http';

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
import { RouterLink, Router } from '@angular/router';
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
import { NavigationService } from '@shared/services/navigation.service';

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
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private alertaService = inject(AlertasService);
  private navigationService = inject(NavigationService);
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
    const samlUrl = `${this.appService.samlUrl}/saml/${this.appService.tenantId}/login`;
    console.log('🚀 ✅ ~ LoginPage ~ loginSaml ~ samlUrl:', samlUrl);
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
      .then(response => {
        this.authService.setLoading(false);
        this.authService.setUser(response.data);
        this.authService.setToken(response.data?.token || null);
        this.authService.userQuery.refetch();
        // Navegar a la primera página disponible en el menú del usuario
        this.navigationService.navegarAPrimeraPaginaDisponible();
      })
      .catch(error => {
        this.authService.setLoading(false);
        this.alertaService.error(
          `Error al iniciar sesión. ${
            (error as HttpErrorResponse)?.error?.message ||
            'Por favor, inténtalo de nuevo.'
          }`,
          500000,
          this.alertaLogin(),
          'w-full block my-2'
        );
      });
  }
}
