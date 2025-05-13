import { Injectable, signal } from '@angular/core';
import { eyeOffOutline } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _emailIconColor = signal('dark');
  private _passwordIconColor = signal('dark');
  private _eyeIconColor = signal('dark');
  private _eyeIcon = signal(eyeOffOutline);
  private showPassword = false;

  constructor() {}

  get emailIconColor() {
    return this._emailIconColor;
  }

  get passwordIconColor() {
    return this._passwordIconColor;
  }

  get eyeIconColor() {
    return this._eyeIconColor;
  }

  get eyeIcon() {
    return this._eyeIcon;
  }

  setEmailIconColor(color: string) {
    this._emailIconColor.set(color);
  }

  setPasswordIconColor(color: string) {
    this._passwordIconColor.set(color);
  }

  setEyeIconColor(color: string) {
    this._eyeIconColor.set(color);
  }

  setEyeIcon(icon: string) {
    this._eyeIcon.set(icon);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.setEyeIcon(this.showPassword ? 'eye' : eyeOffOutline);
  }
}
