import { Component } from '@angular/core';
import { AuthPage } from '@auth/auth.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [AuthPage],
})
export class AppComponent {
  constructor() {}
}
