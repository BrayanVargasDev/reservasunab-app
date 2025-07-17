import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NavigationService } from '@shared/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class DefaultRedirectGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    await this.navigationService.navegarAPrimeraPaginaDisponible();
    return false;
  }
}
