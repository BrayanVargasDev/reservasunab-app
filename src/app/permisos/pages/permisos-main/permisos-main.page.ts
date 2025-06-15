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
import { TablaPermisosComponent } from '@permisos/components/tabla-permisos/tabla-permisos.component';

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
    TablaPermisosComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col grow w-full sm:pl-3 relative',
  },
})
export class PermisosMainPage implements OnInit {
  public appService = inject(AppService);
  public permisosService = inject(PermisosService);

  filtroTexto = signal('');

  roles: Rol[] = [];
  rolSeleccionado: Rol | null = null;

  ngOnInit() {
    addIcons({
      eye,
      create,
      shield,
      addOutline,
    });
  }

  get permisosQuery() {
    return this.permisosService.permisosQuery;
  }

  get rolesQuery() {
    return this.appService.rolesQuery;
  }

  cambiarPestana(pestaña: 'rol' | 'permiso') {
    this.appService.setEditando(false);
    this.permisosService.setModoCreacion(false);
    this.permisosService.setBotonARenderizar(pestaña);
  }

  seleccionarRol(rol: Rol) {
    this.rolSeleccionado = rol;
  }

  tienePermiso(permisoId: string): boolean {
    // return this.rolSeleccionado?.permisos.includes(permisoId) || false;
    return false; // Placeholder, implement actual logic
  }

  togglePermiso(permisoId: string) {
    // if (!this.rolSeleccionado) return;
    // const index = this.rolSeleccionado.permisos.indexOf(permisoId);
    // if (index !== -1) {
    //   // Eliminar permiso
    //   this.rolSeleccionado.permisos.splice(index, 1);
    // } else {
    //   // Agregar permiso
    //   this.rolSeleccionado.permisos.push(permisoId);
    // }
  }

  guardarCambios() {
    console.log('Guardando cambios del rol:', this.rolSeleccionado);
    // Aquí iría la llamada al servicio para guardar los cambios
  }

  crearRol() {
    this.appService.setEditando(true);
    this.permisosService.setModoCreacion(true);
  }
}
