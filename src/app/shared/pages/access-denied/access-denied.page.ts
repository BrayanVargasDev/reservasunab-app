import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavigationService } from '@shared/services/navigation.service';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="w-screen h-screen flex items-center justify-center">
      <div class="error-container">
        <app-web-icon
          nombreIcono="lock-closed-outline"
          class="error-icon"
        ></app-web-icon>
        <h1>403</h1>
        <h2>Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para acceder a esta página.</p>
        <button class="btn btn-primary h-11" (click)="volverAlInicio()">Volver al inicio</button>
      </div>
    </div>
  `,
  styles: [
    `
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100%;
        padding: 20px;
      }

      .error-icon {
        font-size: 80px;
        margin-bottom: 20px;
      }

      h1 {
        font-size: 72px;
        font-weight: 700;
        margin: 0;
        color: var(--ion-color-warning);
      }

      h2 {
        font-size: 24px;
        margin-top: 10px;
        margin-bottom: 20px;
      }

      p {
        font-size: 16px;
        color: var(--ion-color-medium);
        margin-bottom: 30px;
      }

      ion-button {
        --border-radius: 8px;
        max-width: 300px;
      }
    `,
  ],
  standalone: true,
  imports: [IonicModule, WebIconComponent],
})
export class AccessDeniedPage {
  private navigationService = inject(NavigationService);

  volverAlInicio() {
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }
}
