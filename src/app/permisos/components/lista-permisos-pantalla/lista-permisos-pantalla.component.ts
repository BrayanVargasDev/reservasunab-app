import {
  Component,
  input,
  output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';
import { Permiso } from '@permisos/interfaces/permiso.interface';
import { PermisosService } from '@permisos/services/permisos.service';
import { AppService } from '../../../app.service';

@Component({
  selector: 'lista-permisos-pantalla',
  imports: [CommonModule, WebIconComponent],
  template: `
    @if (permisos().length > 0) {
    <!-- Lista de permisos disponibles para la pantalla seleccionada -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto max-h-full">
      @for (permiso of permisos(); track permiso.id_permiso) {
      <div
        class="flex items-center justify-between gap-2 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
      >
        <div class="flex items-center gap-2">
          <div>
            <p class="text-xs md:text-sm text-base-content">
              {{ permiso.descripcion }}
            </p>
          </div>
        </div>
        <label class="cursor-pointer label">
          <input
            type="checkbox"
            [disabled]="disabled()"
            [checked]="permisoActivo(permiso)"
            (change)="onPermisoToggle(permiso, $event)"
            class="checkbox checkbox-primary checkbox-sm "
          />
        </label>
      </div>
      }
    </div>
    } @else {
    <!-- Mensaje cuando no hay permisos para la pantalla -->
    <div class="text-center py-8 w-full">
      <app-web-icon
        nombreIcono="information-circle-outline"
        estilos="h-12 w-12 mx-auto mb-2 text-base-content/50"
      ></app-web-icon>
      <p class="text-base-content/70">
        {{
          !permisosService.pantallaSeleccionada()
            ? 'Seleccione una pantalla para ver sus permisos.'
            : 'No hay permisos disponibles para esta pantalla.'
        }}
      </p>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ListaPermisosPantallaComponent {
  readonly permisosService = inject(PermisosService);
  readonly appService = inject(AppService);
  permisos = input.required<Permiso[]>();
  permisosActivos = input<number[]>([]);
  disabled = input<boolean>(true);

  permisoToggle = output<{ permiso: Permiso; activo: boolean }>();

  permisoActivo(permiso: Permiso): boolean {
    return permiso.concedido || false;
  }

  onPermisoToggle(permiso: Permiso, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.permisoToggle.emit({ permiso, activo: checkbox.checked });
  }
}
