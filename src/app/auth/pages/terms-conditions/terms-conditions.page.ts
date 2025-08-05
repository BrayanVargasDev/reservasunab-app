import {
  Component,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { AlertasService } from '@shared/services/alertas.service';
import { acceptTerms, checkProfileCompleted } from '@auth/actions';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrl: './terms-conditions.page.scss',
  standalone: true,
  imports: [CommonModule, WebIconComponent],
})
export class TermsConditionsPage {
  private router = inject(Router);
  private authService = inject(AuthService);
  private alertaService = inject(AlertasService);

  public alertaTerminos = viewChild.required('alertaTerminos', {
    read: ViewContainerRef,
  });

  isLoading = signal(false);
  privacyPolicyAccepted = signal(false);
  termsAccepted = signal(false);

  // Computed para habilitar el botón solo cuando ambos checks están seleccionados
  canContinue = computed(() => {
    return (
      this.privacyPolicyAccepted() && this.termsAccepted() && !this.isLoading()
    );
  });

  async acceptAndContinue() {
    if (!this.canContinue()) {
      this.alertaService.error(
        'Debes aceptar tanto la política de tratamiento de datos como los términos y condiciones para continuar.',
        5000,
        this.alertaTerminos(),
        'w-full block my-2',
      );
      return;
    }

    this.isLoading.set(true);
    try {
      await acceptTerms(this.authService['http']);

      const profileResponse = await checkProfileCompleted(
        this.authService['http'],
      );

      if (profileResponse.data.perfil_completo) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/perfil'], {
          queryParams: { completeProfile: true },
        });
      }
    } catch (error) {
      console.error('Error al aceptar términos:', error);
      this.alertaService.error(
        'Error al procesar la solicitud. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaTerminos(),
        'w-full block my-2',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  onPrivacyPolicyChange(event: any) {
    this.privacyPolicyAccepted.set(event.target.checked);
  }

  onTermsChange(event: any) {
    this.termsAccepted.set(event.target.checked);
  }

  openPrivacyPolicy() {
    window.open('/assets/documents/politica-tratamiento-datos.txt', '_blank');
  }

  openTermsAndConditions() {
    window.open('/assets/documents/terminos-condiciones-uso.txt', '_blank');
  }
}
