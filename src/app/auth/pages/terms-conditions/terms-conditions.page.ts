import {
  Component,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { ValidationCacheService } from '@auth/services/validation-cache.service';
import { AlertasService } from '@shared/services/alertas.service';
import { acceptTerms, checkProfileCompleted } from '@auth/actions';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ModalInfoTerminosComponent } from '@auth/components/modal-info-terminos/modal-info-terminos.component';
import { TerminosCondicionesComponent } from '@auth/components/terminos-condiciones/terminos-condiciones.component';
import { TratamientoDatosComponent } from '@auth/components/tratamiento-datos/tratamiento-datos.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrl: './terms-conditions.page.scss',
  standalone: true,
  imports: [CommonModule, WebIconComponent, ModalInfoTerminosComponent],
})
export class TermsConditionsPage {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validationCache = inject(ValidationCacheService);
  private alertaService = inject(AlertasService);

  public alertaTerminos = viewChild.required('alertaTerminos', {
    read: ViewContainerRef,
  });

  public modalInfoTerminos = viewChild.required(ModalInfoTerminosComponent);

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
      const acceptResponse = await acceptTerms(this.http);
      const profileResponse = await checkProfileCompleted(this.http);
      const perfilCompleto = profileResponse.data.perfil_completo;

      this.validationCache.setTerminosAceptados(true);
      this.validationCache.setPerfilCompletado(perfilCompleto);

      this.authService.verificarYSincronizarUsuario();

      await new Promise(resolve => setTimeout(resolve, 300));

      if (!perfilCompleto) {
        const navegacionExitosa = await this.router.navigate(['/perfil'], {
          queryParams: { completeProfile: true },
        });

        if (!navegacionExitosa) {
          window.location.href = '/perfil?completeProfile=true';
        }
        return;
      }

      const navegacionExitosa = await this.router.navigate(['/reservas']);
      if (!navegacionExitosa) {
        window.location.href = '/reservas';
      }
    } catch (error) {
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
    this.modalInfoTerminos().abrir(TratamientoDatosComponent, 'Política de Tratamiento de Datos Personales');
  }

  openTermsAndConditions() {
    this.modalInfoTerminos().abrir(TerminosCondicionesComponent, 'Términos y Condiciones de Uso');
  }
}
