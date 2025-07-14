import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-overlay">
      <div class="loading-card">
        <div class="spinner-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <div class="spinner-pulse"></div>
        </div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
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
    }

    .loading-card {
      background: white;
      padding: 3rem 2rem;
      border-radius: 20px;
      text-align: center;
      max-width: 320px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      animation: slideUp 0.5s ease-out;
    }

    .spinner-container {
      position: relative;
      display: inline-block;
      margin-bottom: 2rem;
    }

    ion-spinner {
      transform: scale(2);
    }

    .spinner-pulse {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border: 2px solid rgba(102, 126, 234, 0.3);
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    p {
      color: #666;
      margin: 0 0 2rem 0;
      line-height: 1.5;
    }

    .loading-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .loading-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .loading-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .loading-dots span:nth-child(3) {
      animation-delay: 0.4s;
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

    @keyframes pulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.7;
      }
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LoadingSpinnerComponent {
  @Input() title = 'Cargando';
  @Input() message = 'Por favor espera...';
}
