import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';
import { GlobalLoaderService } from '@shared/services/global-loader.service';

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
  private globalLoader = inject(GlobalLoaderService);

  async ngOnInit() {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.globalLoader.hide();
    this.navigationService.navegarAPrimeraPaginaDisponible();
  }
}
