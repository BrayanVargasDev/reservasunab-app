import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'app-redirect',
  template: `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="loading loading-spinner loading-lg"></div>
        <p class="mt-4 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  `,
  standalone: true,
})
export class RedirectComponent implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }
}
