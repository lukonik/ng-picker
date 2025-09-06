import { Injectable } from '@angular/core';
import { GridRow } from './grid-row';

@Injectable()
export class GridState {
  private _rows: GridRow[] = [];

  addRow(row: GridRow): void {
    this._rows.push(row);
  }

  removeRow(row: GridRow): void {
    const index = this._rows.indexOf(row);
    if (index !== -1) {
      this._rows.splice(index, 1);
    }
  }
}
