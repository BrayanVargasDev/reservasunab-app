import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { addOutline, create, eye, shield } from 'ionicons/icons';
import { AppService } from 'src/app/app.service';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
}

@Component({
  selector: 'app-permisos-main',
  templateUrl: './permisos-main.page.html',
  styleUrls: ['./permisos-main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, WebIconComponent],
})
export class PermisosMainPage implements OnInit {
  appService = inject(AppService);

  filtroTexto = signal('');

  roles: Rol[] = [];
  rolSeleccionado: Rol | null = null;

  // Lista de todos los permisos disponibles en el sistema
  permisosDisponibles: { id: string; nombre: string; categoria: string }[] = [
    { id: 'usuarios_ver', nombre: 'Ver usuarios', categoria: 'Usuarios' },
    { id: 'usuarios_crear', nombre: 'Crear usuarios', categoria: 'Usuarios' },
    { id: 'usuarios_editar', nombre: 'Editar usuarios', categoria: 'Usuarios' },
    {
      id: 'usuarios_eliminar',
      nombre: 'Eliminar usuarios',
      categoria: 'Usuarios',
    },
    { id: 'pagos_ver', nombre: 'Ver pagos', categoria: 'Pagos' },
    { id: 'pagos_crear', nombre: 'Crear pagos', categoria: 'Pagos' },
    { id: 'pagos_procesar', nombre: 'Procesar pagos', categoria: 'Pagos' },
    { id: 'reportes_ver', nombre: 'Ver reportes', categoria: 'Reportes' },
    {
      id: 'reportes_exportar',
      nombre: 'Exportar reportes',
      categoria: 'Reportes',
    },
    {
      id: 'configuracion_ver',
      nombre: 'Ver configuración',
      categoria: 'Configuración',
    },
    {
      id: 'configuracion_editar',
      nombre: 'Editar configuración',
      categoria: 'Configuración',
    },
  ];

  ngOnInit() {
    this.cargarRoles();

    addIcons({
      eye,
      create,
      shield,
      addOutline,
    });
  }

  cargarRoles() {
    // En una implementación real, estos datos vendrían del backend
    this.roles = [
      {
        id: 1,
        nombre: 'Administrador',
        descripcion: 'Acceso completo al sistema',
        permisos: [
          'usuarios_ver',
          'usuarios_crear',
          'usuarios_editar',
          'usuarios_eliminar',
          'pagos_ver',
          'pagos_crear',
          'pagos_procesar',
          'reportes_ver',
          'reportes_exportar',
          'configuracion_ver',
          'configuracion_editar',
        ],
      },
      {
        id: 2,
        nombre: 'Editor',
        descripcion: 'Puede gestionar contenido pero no usuarios',
        permisos: [
          'pagos_ver',
          'pagos_crear',
          'reportes_ver',
          'configuracion_ver',
        ],
      },
      {
        id: 3,
        nombre: 'Visualizador',
        descripcion: 'Solo puede ver información, sin realizar cambios',
        permisos: ['usuarios_ver', 'pagos_ver', 'reportes_ver'],
      },
    ];

    // Seleccionar el primer rol por defecto
    if (this.roles.length > 0) {
      this.rolSeleccionado = this.roles[0];
    }
  }

  seleccionarRol(rol: Rol) {
    this.rolSeleccionado = rol;
  }

  tienePermiso(permisoId: string): boolean {
    return this.rolSeleccionado?.permisos.includes(permisoId) || false;
  }

  categorias(): string[] {
    const categoriasSet = new Set(
      this.permisosDisponibles.map((p) => p.categoria),
    );
    return Array.from(categoriasSet);
  }

  permisosPorCategoria(categoria: string) {
    return this.permisosDisponibles.filter((p) => p.categoria === categoria);
  }

  togglePermiso(permisoId: string) {
    if (!this.rolSeleccionado) return;

    const index = this.rolSeleccionado.permisos.indexOf(permisoId);
    if (index !== -1) {
      // Eliminar permiso
      this.rolSeleccionado.permisos.splice(index, 1);
    } else {
      // Agregar permiso
      this.rolSeleccionado.permisos.push(permisoId);
    }
  }

  guardarCambios() {
    console.log('Guardando cambios del rol:', this.rolSeleccionado);
    // Aquí iría la llamada al servicio para guardar los cambios
  }
}
