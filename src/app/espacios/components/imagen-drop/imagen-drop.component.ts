import { inject, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '@app/app.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  output,
  HostBinding,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'imagen-drop',
  imports: [CommonModule],
  templateUrl: './imagen-drop.component.html',
  styleUrl: './imagen-drop.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagenDropComponent {
  public appService = inject(AppService);
  public fileDropped = output<File>();
  @HostBinding('class.drag-over') isDragOver = false;

  @HostBinding('class.cursor-not-allowed') get isDisabled() {
    return !this.appService.editando();
  }

  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent) {
    evt.stopPropagation();
    this.isDragOver = false;
    if (evt.dataTransfer?.files?.length) {
      this.fileDropped.emit(evt.dataTransfer.files[0]);
    }
  }

  onFileSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileDropped.emit(input.files[0]);
    }
  }
}
