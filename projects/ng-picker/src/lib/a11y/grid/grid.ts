import { contentChildren, Directive, effect, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrdiNavigationDirection } from './grid-cell';
import { GridRow } from './grid-row';

@Directive({
  selector: '[pkGrid]',
})
export class Grid {
  rows = contentChildren(GridRow, { descendants: true });
  sub = new Subscription();
  // Edge navigation outputs
  goToLeft = output<void>();
  goToRight = output<void>();
  goToUp = output<void>();
  goToDown = output<void>();

  constructor() {
    effect(() => {
      const row = this.rows();
      this.sub?.unsubscribe();
      this.sub = new Subscription();
      row.forEach((cell, rowIndex) => {
        this.sub.add(
          cell.navigate.subscribe((event) => {
            this.focusCell(rowIndex, event.cell, event.direction);
          }),
        );
      });
    });
  }

  private focusCell(row: number, col: number, direction: GrdiNavigationDirection) {
    const rows = this.rows();
    if (!rows.length) return;

    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

    switch (direction) {
      case GrdiNavigationDirection.LEFT: {
        if (col <= 0) {
          this.goToLeft.emit();
          return;
        }
        const cell = rows[row].cells()[col - 1];
        cell?.focus();
        return;
      }
      case GrdiNavigationDirection.RIGHT: {
        const lastCol = rows[row].cells().length - 1;
        if (col >= lastCol) {
          this.goToRight.emit();
          return;
        }
        const cell = rows[row].cells()[col + 1];
        cell?.focus();
        return;
      }
      case GrdiNavigationDirection.UP: {
        if (row <= 0) {
          this.goToUp.emit();
          return;
        }
        const targetRow = row - 1;
        const targetCols = rows[targetRow].cells().length;
        const targetCol = clamp(col, 0, targetCols - 1);
        const cell = rows[targetRow].cells()[targetCol];
        cell?.focus();
        return;
      }
      case GrdiNavigationDirection.DOWN: {
        const lastRow = rows.length - 1;
        if (row >= lastRow) {
          this.goToDown.emit();
          return;
        }
        const targetRow = row + 1;
        const targetCols = rows[targetRow].cells().length;
        const targetCol = clamp(col, 0, targetCols - 1);
        const cell = rows[targetRow].cells()[targetCol];
        cell?.focus();
        return;
      }
      default:
        return;
    }
  }
}
