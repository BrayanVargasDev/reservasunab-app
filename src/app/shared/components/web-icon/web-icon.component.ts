import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '@shared/constants';

@Component({
  selector: 'app-web-icon',
  imports: [],
  templateUrl: './web-icon.component.html',
  styleUrl: './web-icon.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebIconComponent {
  nombreIcono = input.required<string>();
  estilos = input<string>();
  contenidoIcono = signal<SafeHtml>('');

  sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.getContenidoIcono();
  }

  getContenidoIcono() {
    const icono = icons[this.nombreIcono()];
    if (icono) {
      this.contenidoIcono.set(this.sanitizer.bypassSecurityTrustHtml(icono));
    }
  }
}
