import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { Column, Row, RowData, type Table } from '@tanstack/angular-table';

// Extiende la definición de meta para columnas responsivas
declare module '@tanstack/table-core' {
  interface ColumnMeta<TData, TValue> {
    className?: string;
    responsive?: boolean;
    priority?: number;
  }
}

@Directive({
  selector: '[responsiveTable]',
  standalone: true,
  exportAs: 'responsiveTable',
})
export class ResponsiveTableDirective<T extends RowData> {
  table = input.required<Table<T>>();

  private host = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private tableWidth = signal(0);
  hiddenColumnIds = signal<Set<string>>(new Set());

  constructor() {
    const resizeObserver = new ResizeObserver(([entry]) => {
      this.tableWidth.set(entry.contentRect.width);
    });

    resizeObserver.observe(this.host.nativeElement);

    this.destroyRef.onDestroy(() => resizeObserver.disconnect());

    effect(() => {
      const width = this.tableWidth();
      const tableInstance = this.table();
      if (!tableInstance) return;

      const allColumns = tableInstance.getAllColumns();

      // Filtra columnas visibles y responsivas
      const responsiveColumns = allColumns
        .filter(col => col.columnDef.meta?.responsive !== false)
        .map(col => ({
          column: col,
          priority: col.columnDef.meta?.priority ?? 0,
          size: col.getSize() || 200,
        }))
        .sort((a, b) => b.priority - a.priority);

      let accumulatedWidth = 0;
      const toHide: string[] = [];

      for (const { column, size } of responsiveColumns) {
        accumulatedWidth += size;
        if (accumulatedWidth > width) {
          toHide.push(column.id);
        }
      }

      const hiddenSet = new Set(toHide);

      // Solo actualiza si hay un cambio real
      const prevHidden = this.hiddenColumnIds();
      const changed =
        toHide.length !== prevHidden.size ||
        toHide.some(id => !prevHidden.has(id));
      if (!changed) return;

      this.hiddenColumnIds.set(hiddenSet);

      const newVisibility = { ...tableInstance.getState().columnVisibility };
      for (const { column } of responsiveColumns) {
        newVisibility[column.id] = !hiddenSet.has(column.id);
      }

      tableInstance.setColumnVisibility(newVisibility);
    });
  }

  getCell(column: Column<T, unknown>, row: Row<T>) {
    return this.table()
      .getRow(row.id)
      .getAllCells()
      .find(cell => cell.column.id === column.id)!;
  }
}
