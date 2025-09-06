import { contentChildren, Directive, effect, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { GrdiNavigationDirection, GridCell } from './grid-cell';

export interface GridRowNavigationEvent {
  cell: number;
  direction: GrdiNavigationDirection;
}

@Directive({
  selector: '[pkGridRow]',
})
export class GridRow {
  cells = contentChildren(GridCell, { descendants: true });
  sub = new Subscription();
  navigate = output<GridRowNavigationEvent>();

  constructor() {
    effect(() => {
      const cells = this.cells();
      console.log('cells', cells);
      this.sub?.unsubscribe();
      this.sub = new Subscription();
      cells.forEach((cell, index) => {
        this.sub.add(
          cell.navigate.subscribe(({ direction }) => {
            this.navigate.emit({ cell: index, direction });
          }),
        );
      });
    });
  }
}
