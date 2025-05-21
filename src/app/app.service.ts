import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private platform = inject(Platform);
  private _esMovil = signal(false);

  constructor() {
    this.checkIfMobile();
  }

  private checkIfMobile(): void {
    this._esMovil.set(this.platform.is('ios') || this.platform.is('android'));
  }

  get esMovil() {
    return this._esMovil;
  }
}
