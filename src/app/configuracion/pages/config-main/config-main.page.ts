import {
  Component,
  computed,
  inject,
  ViewContainerRef,
  viewChild,
} from '@angular/core';

import { ConfigService } from '@configuracion/services/config.service';
import { AuthService } from '@auth/services/auth.service';
import { AppService } from '@app/app.service';
import { CommonModule } from '@angular/common';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { CategoriasComponent } from '@app/configuracion/components/categorias/categorias.component';
import { GruposComponent } from '@app/configuracion/components/grupos/grupos.component';

@Component({
  selector: 'config-main-page',
  imports: [
    CommonModule,
    WebIconComponent,
    CategoriasComponent,
    GruposComponent,
  ],
  templateUrl: './config-main.page.html',
  styleUrl: './config-main.page.scss',
  host: {
    class: 'flex flex-col w-full h-full sm:pl-3 relative overflow-y-auto',
  },
})
export default class ConfigMainPageComponent {
  public configService = inject(ConfigService);
  public authService = inject(AuthService);
  public appService = inject(AppService);

  public categoriasChecked = computed(
    () => this.configService.pestana() === 'categorias',
  );
  public gruposChecked = computed(
    () => this.configService.pestana() === 'grupos',
  );

  public alertaConfig = viewChild.required('alertaConfig', {
    read: ViewContainerRef,
  });

  public cambiarPestana(pestana: 'categorias' | 'grupos') {
    this.configService.setPestana(pestana);
    this.configService.setModoCreacionCategoria(false);
    this.appService.setEditando(false);
    this.configService.setPaginacionCategorias({
      pageIndex: 0,
      pageSize: 10,
    });
  }

  ngOnInit() {
    this.configService.setAlertaConfig(this.alertaConfig());
  }

  public crear() {
    switch (this.configService.pestana()) {
      case 'categorias':
        this.configService.inciarCrearCategoria();
        break;
      case 'grupos':
        this.configService.inciarCrearGrupo();
        break;
      default:
        console.error('Pestana no reconocida');
        break;
    }
  }

  public tituloBotonCrear() {
    switch (this.configService.pestana()) {
      case 'categorias':
        return 'Crear Categoría';
      case 'grupos':
        return 'Crear Grupo';
      default:
        return 'Crear';
    }
  }
}
