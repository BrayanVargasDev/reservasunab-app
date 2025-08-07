import {
  Component,
  viewChild,
  ElementRef,
  signal,
  ChangeDetectionStrategy,
  ComponentRef,
  ViewContainerRef,
  inject,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebIconComponent } from '@shared/components/web-icon/web-icon.component';

@Component({
  selector: 'app-modal-info-terminos',
  imports: [CommonModule, WebIconComponent],
  templateUrl: './modal-info-terminos.component.html',
  styleUrl: './modal-info-terminos.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoTerminosComponent {
  private environmentInjector = inject(EnvironmentInjector);

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');
  contenidoContainer = viewChild.required('contenidoContainer', {
    read: ViewContainerRef,
  });

  titulo = signal<string>('');

  private componenteRef: ComponentRef<any> | null = null;

  abrir(componenteClass: any, titulo: string) {
    this.titulo.set(titulo);
    this.modal().nativeElement.showModal();

    // Limpiar contenido anterior
    this.contenidoContainer().clear();

    // Crear el componente dinámicamente
    this.componenteRef = createComponent(componenteClass, {
      environmentInjector: this.environmentInjector,
    });

    // Insertar el componente en el container
    this.contenidoContainer().insert(this.componenteRef.hostView);
  }

  cerrar() {
    this.modal().nativeElement.close();
    if (this.componenteRef) {
      this.componenteRef.destroy();
      this.componenteRef = null;
    }
  }

  onDialogClick(event: MouseEvent) {
    const dialogElement = this.modal().nativeElement;
    const rect = dialogElement.getBoundingClientRect();

    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      this.cerrar();
    }
  }
}
