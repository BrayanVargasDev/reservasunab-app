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

    this.destroyRef.onDestroy(() => {
      resizeObserver.disconnect();
    });

    effect(() => {
      const width = this.tableWidth();

      if (!this.table) return;

      const allColumns = this.table().getAllColumns();
      const responsiveColumns = allColumns
        .filter((column) => column.columnDef.meta?.responsive !== false)
        .map((column) => ({
          column,
          priority: column.columnDef.meta?.priority ?? 0,
          size: column.getSize() || 200,
        }))
        .sort((a, b) => b.priority - a.priority);

      let total = 0;
      const toHide: string[] = [];

      for (const { column, size } of responsiveColumns) {
        total += size;
        if (total > width) {
          toHide.push(column.id);
        }
      }

      this.hiddenColumnIds.set(new Set(toHide));

      const newVisibility = { ...this.table().getState().columnVisibility };
      for (const { column } of responsiveColumns) {
        newVisibility[column.id] = !toHide.includes(column.id);
      }

      this.table().setColumnVisibility(newVisibility);
    });
  }

  getCell(column: Column<T, unknown>, row: Row<T>) {
    const cell = this.table()!
      .getRow(row.id)
      .getAllCells()
      .find((cell) => cell.column.id === column.id)!;

    return cell;
  }
}
