import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  input,
  output,
  computed,
  effect,
  signal,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PaginationState } from '@tanstack/angular-table';
import { Meta, Link } from '@shared/interfaces';
import { inject } from '@angular/core';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginadorComponent {
  private injector = inject(Injector);

  valorSelect = new FormControl(5);

  paginacion = input<Meta | null>(null);
  estado = input.required<PaginationState>();
  mostrarSelectorTamano = input(true);
  mostrarInfo = input(true);
  mostrarExtremos = input(true);
  opcionesTamano = input<number[]>([5, 10, 25, 50, 100]);
  deshabilitado = input(false);
  prefetchFunction = output<PaginationState>();

  cambioPaginacion = output<PaginationState>();

  tempInputPagina = signal('');

  paginaActual = computed(() => this.estado().pageIndex + 1);

  totalPaginas = computed(() => this.paginacion()?.last_page ?? 1);
  totalRegistros = computed(() => this.paginacion()?.total ?? 0);
  desde = computed(() => this.paginacion()?.from ?? 0);
  hasta = computed(() => this.paginacion()?.to ?? 0);

  puedeRetroceder = computed(() => this.estado().pageIndex > 0);
  puedeAvanzar = computed(
    () => this.estado().pageIndex < this.totalPaginas() - 1,
  );

  paginasVisibles = computed(() => {
    const enlaces = this.paginacion()?.links || [];
    return enlaces.map((link, index) => ({
      ...link,
      tablePageIndex: index > 0 ? index - 1 : 0,
      label: link.label
        .replace('&laquo; Previous', '&lsaquo;')
        .replace('Next &raquo;', '&rsaquo;'),
    }));
  });

  ngOnInit() {
    effect(
      () => {
        const currentPageSize = this.estado().pageSize;
        if (this.valorSelect.value !== currentPageSize) {
          this.valorSelect.setValue(currentPageSize, { emitEvent: false });
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  cambiarPagina(pagina: number) {
    if (this.deshabilitado() || pagina < 0 || pagina >= this.totalPaginas())
      return;
    this.cambioPaginacion.emit({
      pageIndex: pagina,
      pageSize: this.estado().pageSize,
    });
  }

  irPaginaDesdeLink(link: Link) {
    if (
      this.deshabilitado() ||
      !link.url ||
      link.label === '...' ||
      link.active
    )
      return;
    if (link.label === '&lsaquo;') return this.anterior();
    if (link.label === '&rsaquo;') return this.siguiente();

    const numero = parseInt(link.label, 10);
    if (!isNaN(numero)) this.cambiarPagina(numero - 1);
  }

  cambiarTamanoPagina(tamano: number) {
    if (this.deshabilitado()) return;
    this.cambioPaginacion.emit({
      pageIndex: 0,
      pageSize: tamano,
    });
  }

  irPrimera() {
    this.cambiarPagina(0);
  }

  irUltima() {
    this.cambiarPagina(this.totalPaginas() - 1);
  }

  anterior() {
    this.cambiarPagina(this.estado().pageIndex - 1);
  }

  siguiente() {
    this.cambiarPagina(this.estado().pageIndex + 1);
  }

  onPageInputChange(value: string) {
    this.tempInputPagina.set(value);
  }

  onPageInputBlur() {
    const value = this.tempInputPagina();
    const pagina = parseInt(value, 10);
    if (!isNaN(pagina) && pagina >= 1 && pagina <= this.totalPaginas()) {
      this.cambiarPagina(pagina - 1);
    }
    this.tempInputPagina.set('');
  }

  onPageInputKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onPageInputBlur();
    }
  }

  onMouseEnter(paginacion: PaginationState) {
    this.prefetchFunction.emit(paginacion);
  }
}
