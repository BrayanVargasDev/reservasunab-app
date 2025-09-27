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
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';

import { ActionButtonComponent } from '@shared/components/action-button/action-button.component';
import { FormUtils } from '@shared/utils/form.utils';
import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { AuthService } from '@auth/services/auth.service';
import { MobileAuthService } from '@auth/services/mobile-auth.service';
import { AlertasService } from '@shared/services/alertas.service';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // RouterLink,
    ReactiveFormsModule,
    WebIconComponent,
  ],
})
export class LoginPage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private alertaService = inject(AlertasService);
  private navigationService = inject(NavigationService);
  public appService = inject(AppService);
  public authService = inject(AuthService);
  private mobileAuthService = inject(MobileAuthService);

  ngOnInit() {
    // Verificar si hay errores de SSO en los query params
    const ssoError = this.route.snapshot.queryParams['sso_error'];
    if (ssoError) {
      const errorDescription =
        this.route.snapshot.queryParams['sso_error_description'] ||
        'Error en autenticación SSO';
      let userFriendlyMessage = 'Error en la autenticación con Google. ';

      switch (ssoError) {
        case 'access_denied':
          userFriendlyMessage += 'Acceso denegado por el usuario.';
          break;
        case 'no_code':
          userFriendlyMessage += 'No se recibió la autorización necesaria.';
          break;
        case 'token_exchange_failed':
          userFriendlyMessage += 'Error al intercambiar el token.';
          break;
        case 'unexpected_error':
          userFriendlyMessage += 'Error inesperado. Inténtelo de nuevo.';
          break;
        default:
          userFriendlyMessage += errorDescription;
      }

      this.alertaService.error(
        userFriendlyMessage,
        8000,
        this.alertaLogin(),
        'w-full block my-2',
      );

      this.authService.setLoading(false);

      // Limpiar los parámetros de error de la URL
      this.router.navigate([], {
        queryParams: { sso_error: null, sso_error_description: null },
        queryParamsHandling: 'merge',
      });
    }
  }

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

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  obtenerColorIcono(campo: string): string {
    return this.formUtils.esCampoInvalido(this.loginForm, campo)
      ? 'danger'
      : 'dark';
  }

  loginSaml() {
    try {
      this.disableForm();
      this.authService.setLoading(true);

      const samlUrl = `${this.appService.samlUrl}/api/saml/${this.appService.tenantId}/login`;

      if (!samlUrl || !this.appService.samlUrl || !this.appService.tenantId) {
        this.alertaService.error(
          'Configuración de SSO incompleta. Contacte al administrador.',
          5000,
          this.alertaLogin(),
          'w-full block my-2',
        );
        this.authService.setLoading(false);
        this.loginForm.enable();
        return;
      }

      console.debug('Redirecting to SAML SSO:', samlUrl);

      // Limpiar cualquier estado anterior antes de redirigir
      this.authService.clearSession();

      if (Capacitor.isNativePlatform()) {
        this.mobileAuthService.loginWithSaml();
      } else {
        setTimeout(() => {
          window.location.href = samlUrl;
        }, 100);
      }
    } catch (error) {
      console.error('Error initiating SAML login:', error);
      this.alertaService.error(
        'Error al iniciar sesión con SSO. Inténtelo de nuevo.',
        5000,
        this.alertaLogin(),
        'w-full block my-2',
      );
      this.authService.setLoading(false);
      this.loginForm.enable();
    }
  }

  disableForm() {
    this.loginForm.disable();
  }

  async onLogin(): Promise<void> {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.loginForm.enable();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.setLoading(true);
    this.disableForm();

    try {
      const logueado = await this.authService.login(email, password);

      if (!logueado) {
        throw new Error('No se pudo iniciar sesión. Inténtalo de nuevo.');
      }
      await this.navegarDespesDeLogin();
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.authService.setLoading(false);
      this.loginForm.enable();
    }
  }

  private async navegarDespesDeLogin() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    try {
      const dest = await this.authService.validarTerminosYPerfil();

      if (dest && dest !== '/') {
        return this.router.navigateByUrl(dest, { replaceUrl: true });
      }

      if (returnUrl && returnUrl !== '/') {
        return this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      }

      return this.router.navigateByUrl('/', { replaceUrl: true });
    } catch {
      return this.router.navigateByUrl('/reservas');
    }
  }

  private handleLoginError(error: unknown): void {
    const errorMessage =
      (error as HttpErrorResponse)?.error?.message ||
      'Por favor, inténtalo de nuevo.';

    this.alertaService.error(
      `Error al iniciar sesión. ${errorMessage}`,
      500000,
      this.alertaLogin(),
      'w-full block my-2',
    );

    this.authService.setLoading(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
