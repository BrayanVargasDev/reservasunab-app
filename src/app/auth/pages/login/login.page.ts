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
import { environment } from '@environments/environment';
import { loginGoogleAction } from '@app/auth/actions';

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
  mostrarLoginForm = signal(false);

  async ngOnInit() {
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

  async loginGoogle() {
    try {
      this.disableForm();
      this.authService.setLoading(true);
      this.authService.clearSession();

      // Detectar Safari iOS específicamente
      const isIOSWeb = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isIOSWeb) {
        this.redirectToGoogleOAuth();
        return;
      } else {
        console.log('No es Safari iOS, procediendo con login normal');
        const success = await this.mobileAuthService.loginWithGoogle();
        
        if (success) {
          await this.navegarDespesDeLogin();
        } else {
          throw new Error('Login falló');
        }
      }
      
    } catch (error) {
      console.error('Error en loginGoogle:', error);
      
      let errorMessage = 'Error al iniciar sesión con Google. ';
      
      if (error instanceof Error) {
        if (error.message.includes('popup')) {
          errorMessage += 'Por favor, permite las ventanas emergentes en tu navegador.';
        } else if (error.message.includes('network')) {
          errorMessage += 'Verifica tu conexión a internet.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Inténtelo de nuevo.';
      }
      
      this.alertaService.error(
        errorMessage,
        8000,
        this.alertaLogin(),
        'w-full block my-2',
      );
      this.authService.setLoading(false);
      this.loginForm.enable();
    }
  }

  private redirectToGoogleOAuth(): void {
    try {
      const baseUrl = window.location.origin;
      const clientId = environment.googleWebId;
      const redirectUri = encodeURIComponent(`${baseUrl}/auth/callback`);
      const state = Math.random().toString(36).substring(2, 15);
      const nonce = Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
      
      // URL OAuth optimizada para Safari iOS
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('email profile openid')}` +
        `&access_type=offline` +
        `&prompt=select_account` +
        `&state=${state}` +
        `&nonce=${nonce}`;
      
      // Redirección después de un breve delay
      setTimeout(() => {
        window.location.href = authUrl;
      }, 1000);
      
    } catch (error) {
      console.error('Error en redirección OAuth:', error);
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
      const [logueado, errorMessage] = await this.authService.login(
        email,
        password,
      );

      if (!logueado) {
        throw new Error(errorMessage);
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
    } catch (error) {
      console.error('Error en navegación después del login:', error);
      return this.router.navigateByUrl('/reservas');
    }
  }

  private handleLoginError(error: unknown): void {
    let errorMessage = 'Por favor, inténtalo de nuevo.';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error instanceof HttpErrorResponse) {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage =
          'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos. Revisa la información ingresada.';
      } else if (error.status >= 500) {
        errorMessage = 'Error del servidor. Inténtalo más tarde.';
      } else if (error.status === 0) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    this.alertaService.error(
      `Error al iniciar sesión. ${errorMessage}`,
      10000,
      this.alertaLogin(),
      'w-full block my-2',
    );

    this.authService.setLoading(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toggleLoginForm(): void {
    this.mostrarLoginForm.set(true);
  }
}
