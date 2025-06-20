import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';

import { EspaciosService } from '@espacios/services/espacios.service';
import { AppService } from '@app/app.service';
import { EspaciosConfigService } from '@espacios/services/espacios-config.service';
import { EspacioGeneralComponent } from '@espacios/components/espacio-general/espacio-general.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EspacioGeneralComponent],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage {
  public appService = inject(AppService);
  private espacioConfigService = inject(EspaciosConfigService);
  private route = inject(ActivatedRoute);

  private espacioId = toSignal<string>(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? ''),
      tap(id => this.espacioConfigService.setIdEspacio(parseInt(id, 10))),
    ),
  );

  public alertaEspacioConfig = viewChild.required('alertaEspacioConfig', {
    read: ViewContainerRef,
  });

  ngOnInit() {
    this.espacioConfigService.setAlertaEspacioConfigRef(
      this.alertaEspacioConfig()
    );
  }

  public get espacioQuery() {
    return this.espacioConfigService.espacioQuery;
  }

  cambiarPestana(pestaña: 'general' | 'base' | 'tipoUsuario' | 'fecha') {
    this.appService.setEditando(false);
    this.espacioConfigService.setPestana(pestaña);
  }
}
