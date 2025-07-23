import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline, create, eye, shield } from 'ionicons/icons';

import { AppService } from '@app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { PermisosService } from '@permisos/services/permisos.service';
import { Rol } from '@permisos/interfaces';
import { TablaRolesComponent } from '@permisos/components/tabla-roles/tabla-roles.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-permisos-main',
  templateUrl: './permisos-main.page.html',
  styleUrls: ['./permisos-main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WebIconComponent,
    TablaRolesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
})
export class PermisosMainPage implements OnInit {
  public authService = inject(AuthService);
  public appService = inject(AppService);
  public permisosService = inject(PermisosService);

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  roles: Rol[] = [];
  rolSeleccionado: Rol | null = null;

  ngOnInit() {
    addIcons({
      eye,
      create,
      shield,
      addOutline,
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((texto: string) => {
        this.permisosService.setFiltroTexto(texto);
      });
  }

  get permisosQuery() {
    return this.permisosService.permisosQuery;
  }

  get rolesQuery() {
    return this.appService.rolesQuery;
  }

  cambiarPestana(pestana: 'rol') {
    this.appService.setEditando(false);
    this.permisosService.setModoCreacion(false);
    this.permisosService.setPestana(pestana);
  }

  seleccionarRol(rol: Rol) {
    this.rolSeleccionado = rol;
  }

  limpiarFiltro() {
    this.permisosService.limpiarFiltro();
  }

  aplicarFiltro(texto: string) {
    this.searchSubject.next(texto);
  }

  crearRol() {
    this.permisosService.iniciarCrearRol();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
