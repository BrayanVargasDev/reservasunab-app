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
import { acceptTerms, checkProfileCompleted } from '@auth/actions';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { ModalInfoTerminosComponent } from '@auth/components/modal-info-terminos/modal-info-terminos.component';
import { TerminosCondicionesComponent } from '@auth/components/terminos-condiciones/terminos-condiciones.component';
import { TratamientoDatosComponent } from '@auth/components/tratamiento-datos/tratamiento-datos.component';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { StorageService } from '@shared/services/storage.service';
import { STORAGE_KEYS } from '@auth/constants/storage.constants';

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

  public alertaTerminos = viewChild.required('alertaTerminos', {
    read: ViewContainerRef,
  });

  public modalInfoTerminos = viewChild.required(ModalInfoTerminosComponent);

  ngOnInit() {
    this.globalLoader.hide();
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
      const acceptResponse = await acceptTerms(this.http);

      this.storage.setItem(STORAGE_KEYS.TERMS_ACCEPTED, JSON.stringify(true));

      await new Promise(resolve => setTimeout(resolve, 300));
      this.globalLoader.show(
        'Terminos y condiciones aceptados',
        'Cargando datos del perfil...',
      );

      const { data } = await checkProfileCompleted(this.http);
      const perfilCompleto = data.perfil_completo;

      this.storage.setItem(
        STORAGE_KEYS.PROFILE_COMPLETED,
        JSON.stringify(perfilCompleto),
      );

      if (!perfilCompleto) {
        return this.router.navigate(['/perfil'], {
          replaceUrl: true,
          queryParams: { completeProfile: true },
        });
      }

      return this.router.navigate(['/'], { replaceUrl: true });
    } catch (error) {
      this.alertaService.error(
        'Error al procesar la solicitud. Por favor, inténtalo de nuevo.',
        5000,
        this.alertaTerminos(),
        'w-full block my-2',
      );
      this.globalLoader.hide();
      this.isLoading.set(false);
      return;
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
