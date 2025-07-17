import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { NavigationService } from '@shared/services/navigation.service';
import { WebIconComponent } from "@app/shared/components/web-icon/web-icon.component";

@Component({
  selector: 'app-not-found',
  template: `
    <ion-content class="ion-padding">
      <div class="error-container">
        <app-web-icon
          nombreIcono="alert-circle-outline"
          color="danger"
          estilos="h-15 w-15 text-error"></app-web-icon>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>La página que estás buscando no existe o ha sido movida.</p>
        <ion-button
          (click)="volverAlInicio()"
          expand="block">
          Volver al inicio
        </ion-button>
      </div>
    </ion-content>
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
        color: var(--ion-color-danger);
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
export class NotFoundPage {
  private navigationService = inject(NavigationService);

  volverAlInicio() {
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }
}
