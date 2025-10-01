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

  valorSelect = new FormControl(10);

  paginacion = input<Meta | null>(null);
  estado = input.required<PaginationState>();
  mostrarSelectorTamano = input(true);
  mostrarInfo = input(true);
  mostrarExtremos = input(true);
  opcionesTamano = input<number[]>([10, 25, 50, 100]);
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
    const total = this.totalPaginas();
    const current = this.paginaActual();
    const pages: any[] = [];

    // First button if mostrarExtremos
    if (this.mostrarExtremos()) {
      pages.push({
        label: '&laquo;',
        url: this.puedeRetroceder() ? 'first' : null,
        active: false,
        tablePageIndex: -1,
      });
    }

    // Previous button
    pages.push({
      label: '&lsaquo;',
      url: this.puedeRetroceder() ? 'previous' : null,
      active: false,
      tablePageIndex: -1,
    });

    if (total <= 4) {
      // Show all pages
      for (let i = 1; i <= total; i++) {
        pages.push({
          label: i.toString(),
          url: i !== current ? 'page' : null,
          active: i === current,
          tablePageIndex: i - 1,
        });
      }
    } else {
      // Show max 4 numbers
      if (current <= 3) {
        // Show first 4
        for (let i = 1; i <= 4; i++) {
          pages.push({
            label: i.toString(),
            url: i !== current ? 'page' : null,
            active: i === current,
            tablePageIndex: i - 1,
          });
        }
      } else if (current >= total - 2) {
        // Show last 4
        for (let i = total - 3; i <= total; i++) {
          pages.push({
            label: i.toString(),
            url: i !== current ? 'page' : null,
            active: i === current,
            tablePageIndex: i - 1,
          });
        }
      } else {
        // Show 1 ... current current+1 ... total
        pages.push({
          label: '1',
          url: 1 !== current ? 'page' : null,
          active: 1 === current,
          tablePageIndex: 0,
        });
        pages.push({
          label: '...',
          url: null,
          active: false,
          tablePageIndex: -1,
        });
        pages.push({
          label: current.toString(),
          url: current !== current ? 'page' : null,
          active: true,
          tablePageIndex: current - 1,
        });
        pages.push({
          label: (current + 1).toString(),
          url: current + 1 !== current ? 'page' : null,
          active: false,
          tablePageIndex: current,
        });
        pages.push({
          label: '...',
          url: null,
          active: false,
          tablePageIndex: -1,
        });
        pages.push({
          label: total.toString(),
          url: total !== current ? 'page' : null,
          active: total === current,
          tablePageIndex: total - 1,
        });
      }
    }

    // Next button
    pages.push({
      label: '&rsaquo;',
      url: this.puedeAvanzar() ? 'next' : null,
      active: false,
      tablePageIndex: -1,
    });

    // Last button if mostrarExtremos
    if (this.mostrarExtremos()) {
      pages.push({
        label: '&raquo;',
        url: this.puedeAvanzar() ? 'last' : null,
        active: false,
        tablePageIndex: -1,
      });
    }

    return pages;
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
    if (link.label === '&laquo;') return this.irPrimera();
    if (link.label === '&lsaquo;') return this.anterior();
    if (link.label === '&rsaquo;') return this.siguiente();
    if (link.label === '&raquo;') return this.irUltima();

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
