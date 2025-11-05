import {
  Component,
  inject,
  signal,
  viewChild,
  ViewContainerRef,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AlertasService } from '@shared/services/alertas.service';
import { acceptTerms, checkProfileCompleted, checkTermsAccepted } from '@auth/actions';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ModalInfoTerminosComponent } from '@auth/components/modal-info-terminos/modal-info-terminos.component';
import { TerminosCondicionesComponent } from '@auth/components/terminos-condiciones/terminos-condiciones.component';
import { TratamientoDatosComponent } from '@auth/components/tratamiento-datos/tratamiento-datos.component';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { StorageService } from '@shared/services/storage.service';
import { STORAGE_KEYS } from '@auth/constants/storage.constants';
import { UserStateEventsService } from '@shared/services/user-state-events.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrl: './terms-conditions.page.scss',
  standalone: true,
  imports: [CommonModule, WebIconComponent, ModalInfoTerminosComponent],
})
export class TermsConditionsPage implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private alertaService = inject(AlertasService);
  private storage = inject(StorageService);
  private globalLoader = inject(GlobalLoaderService);
  private userStateEvents = inject(UserStateEventsService);

  public alertaTerminos = viewChild.required('alertaTerminos', {
    read: ViewContainerRef,
  });

  public modalInfoTerminos = viewChild.required(ModalInfoTerminosComponent);

  ngOnInit() {
    this.globalLoader.hide();
    this.checkIfTermsAlreadyAccepted();
  }

  private async checkIfTermsAlreadyAccepted() {
    try {
      console.log('[TermsConditions] Verificando si términos ya están aceptados...');
      const { data } = await checkTermsAccepted(this.http);
      const termsAccepted = data.terminos_condiciones;
      
      if (termsAccepted) {
        console.log('[TermsConditions] Términos ya aceptados, verificando perfil...');
        // Si ya aceptó términos, verificar perfil y redirigir
        const profileResponse = await checkProfileCompleted(this.http);
        const perfilCompleto = profileResponse.data.perfil_completo;
        
        if (!perfilCompleto) {
          console.log('[TermsConditions] Redirigiendo a completar perfil');
          this.router.navigate(['/perfil'], { replaceUrl: true });
        } else {
          console.log('[TermsConditions] Redirigiendo al dashboard');
          this.router.navigate(['/'], { replaceUrl: true });
        }
      } else {
        console.log('[TermsConditions] Términos no aceptados, mostrar página');
      }
    } catch (error) {
      console.error('[TermsConditions] Error verificando términos:', error);
      // En caso de error, permitir que el usuario vea la página
    }
  }

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
      console.log('[TermsConditions] Iniciando proceso de aceptación de términos');
      
      // Aceptar términos en el backend
      console.log('[TermsConditions] Enviando aceptación de términos...');
      await acceptTerms(this.http);
      console.log('[TermsConditions] Términos aceptados exitosamente');

      // Emitir evento de términos aceptados para que MainLayout refresque el estado
      this.userStateEvents.emitTermsAccepted();

      await new Promise(resolve => setTimeout(resolve, 300));
      this.globalLoader.show(
        'Terminos y condiciones aceptados',
        'Verificando completitud del perfil...',
      );

      // Verificar estado del perfil desde el backend
      console.log('[TermsConditions] Verificando estado del perfil...');
      const { data } = await checkProfileCompleted(this.http);
      const perfilCompleto = data.perfil_completo;
      console.log('[TermsConditions] Estado del perfil:', { perfilCompleto });

      // Ocultar el loader antes de la navegación
      this.globalLoader.hide();
      console.log('[TermsConditions] Loader ocultado, navegando...');

      if (!perfilCompleto) {
        // Redirigir a completar perfil sin queryParams
        console.log('[TermsConditions] Navegando a completar perfil');
        return this.router.navigate(['/perfil'], {
          replaceUrl: true,
        });
      }

      // Si el perfil está completo, ir al dashboard
      console.log('[TermsConditions] Navegando al dashboard');
      return this.router.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      console.error('[TermsConditions] Error al aceptar términos:', error);
      this.alertaService.error(
        'Error al procesar la solicitud. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaTerminos(),
        'w-full block my-2',
      );
      this.globalLoader.hide();
      this.isLoading.set(false);
      return;
    } finally {
      console.log('[TermsConditions] Finalizando proceso...');
      this.isLoading.set(false);
      // Garantizar que el loader se oculte en cualquier caso
      setTimeout(() => {
        this.globalLoader.hide();
        console.log('[TermsConditions] Loader ocultado en finally como seguridad');
      }, 100);
    }
  }

  onPrivacyPolicyChange(event: any) {
    this.privacyPolicyAccepted.set(event.target.checked);
  }

  onTermsChange(event: any) {
    this.termsAccepted.set(event.target.checked);
  }

  openPrivacyPolicy() {
    this.modalInfoTerminos().abrir(
      TratamientoDatosComponent,
      'Política de Tratamiento de Datos Personales',
    );
  }

  openTermsAndConditions() {
    this.modalInfoTerminos().abrir(
      TerminosCondicionesComponent,
      'Términos y Condiciones de Uso',
    );
  }
}
