import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    // const requiredPermission = route.data['permission'] as string;

    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['/auth/login'], {
    //     queryParams: { returnUrl: state.url },
    //   });
    //   return false;
    // }

    // if (
    //   requiredPermission &&
    //   !this.authService.hasPermission(requiredPermission)
    // ) {
    //   this.router.navigate(['/acceso-denegado']);
    //   return false;
    // }

    return true;
  }
}
