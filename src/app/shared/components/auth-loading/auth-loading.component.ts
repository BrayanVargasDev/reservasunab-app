import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-loading',
  template: `
    <div class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="mt-4 text-gray-600">Verificando autenticación...</p>
      </div>
    </div>
  `,
  standalone: true,
})
export class AuthLoadingComponent {}
