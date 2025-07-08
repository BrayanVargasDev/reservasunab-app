import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  viewChild,
  ViewContainerRef,
  effect,
  Injector,
  OnDestroy,
  computed,
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
import { TablaConfigTipoUsuarioComponent } from '@espacios/components/tabla-config-tipo-usuario/tabla-config-tipo-usuario.component';
import { ConfigPorFechaComponent } from '@espacios/components/config-por-fecha/config-por-fecha.component';
import { ConfigBaseComponent } from '@espacios/components/config-base/config-base.component';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { UpperFirstPipe } from '@shared/pipes';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EspacioGeneralComponent,
    TablaConfigTipoUsuarioComponent,
    ConfigPorFechaComponent,
    ConfigBaseComponent,
    BreadcrumbsComponent,
    UpperFirstPipe
  ],
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage implements OnInit, OnDestroy {
  public appService = inject(AppService);
  private injector = inject(Injector);
  private espacioConfigService = inject(EspaciosConfigService);
  private route = inject(ActivatedRoute);

  private espacioId = toSignal<string>(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? ''),
      tap(id => this.espacioConfigService.setIdEspacio(parseInt(id, 10))),
    ),
  );

  public generalChecked = computed(
    () => this.espacioConfigService.pestana() === 'general',
  );
  public baseChecked = computed(
    () => this.espacioConfigService.pestana() === 'base',
  );
  public tipoUsuarioChecked = computed(
    () => this.espacioConfigService.pestana() === 'tipoUsuario',
  );
  public fechaChecked = computed(
    () => this.espacioConfigService.pestana() === 'fecha',
  );
  public novedadesChecked = computed(
    () => this.espacioConfigService.pestana() === 'novedades',
  );

  public alertaEspacioConfig = viewChild.required('alertaEspacioConfig', {
    read: ViewContainerRef,
  });

  ngOnInit() {
    this.espacioConfigService.setAlertaEspacioConfigRef(
      this.alertaEspacioConfig(),
    );

    effect(
      () => {
        this.espacioConfigService.pestana();

        this.appService.setEditando(false);
        this.espacioConfigService.resetAll();
      },
      {
        injector: this.injector,
      },
    );
  }

  public get espacioQuery() {
    return this.espacioConfigService.espacioQuery;
  }

  cambiarPestana(pestaña: 'general' | 'base' | 'tipoUsuario' | 'fecha' | 'novedades') {
    this.appService.setEditando(false);
    this.espacioConfigService.setPestana(pestaña);
  }

  ngOnDestroy() {
    this.espacioConfigService.setImagen('');
  }
}
