import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { WebIconComponent } from '@app/shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-error-display',
  template: `
    <div class="error-overlay">
      <div class="error-card">
        <div class="error-icon-container">
          <app-web-icon
            nombreIcono="alert-circle"
            estilos="error-icon"
          ></app-web-icon>
        </div>
        <h3>{{ titulo }}</h3>
        <p>{{ mensaje }}</p>
        <div class="error-actions">
          @if (showRetry) {
          <button
            fill="outline"
            color="primary"
            (click)="onRetry()"
            class="btn btn-primary btn-outline font-semibold h-12 rounded-xl action-button"
          >
            <app-web-icon nombreIcono="refresh"></app-web-icon>
            {{ retryText }}
          </button>
          }
          <button
            fill="solid"
            color="primary"
            (click)="onGoHome()"
            class="btn btn-primary font-semibold h-12 rounded-xl action-button"
          >
            <app-web-icon nombreIcono="home"></app-web-icon>
            {{ homeText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .error-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
      }

      .error-card {
        background: white;
        padding: 3rem 2rem;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        animation: slideUp 0.5s ease-out;
      }

      .error-icon-container {
        margin-bottom: 2rem;
      }

      .error-icon {
        font-size: 4rem;
        color: #f44336;
        animation: shake 0.5s ease-in-out;
      }

      h3 {
        color: #333;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      p {
        color: #666;
        margin: 0 0 2rem 0;
        line-height: 1.6;
        font-size: 1rem;
      }

      .error-actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes shake {
        0%,
        100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      @media (min-width: 480px) {
        .error-actions {
          flex-direction: row;
          justify-content: center;
        }

        .action-button {
          min-width: 140px;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, IonicModule, WebIconComponent],
})
export class ErrorDisplayComponent {
  @Input() titulo = '¡Ups! Algo salió mal';
  @Input() mensaje = 'Ha ocurrido un error inesperado.';
  @Input() showRetry = true;
  @Input() retryText = 'Reintentar';
  @Input() homeText = 'Volver al inicio';

  @Output() retry = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }

  onGoHome() {
    this.goHome.emit();
  }
}
