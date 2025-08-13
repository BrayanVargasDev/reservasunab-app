import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalLoaderService } from '@shared/services/global-loader.service';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent {
  private globalLoaderService = inject(GlobalLoaderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // reaccionar a los parámetos en la ruta y hacer una patición con el código que viene en la ruta
  ngOnInit() {
    this.route.params.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.globalLoaderService.show();




      }
    });
  }
}
