import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible()) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        <div class="flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-800">{{ title() }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ message() }}</p>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class GlobalLoaderComponent {
  isVisible = input<boolean>(false);
  title = input<string>('Cargando...');
  message = input<string>('Por favor espera mientras procesamos tu información');
}
