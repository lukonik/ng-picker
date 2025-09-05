import { Component, computed, inject, input } from '@angular/core';
import { DateCell } from '../../types/ng-picker.types';
import { DateAdapter } from '../../adapters/date-adapter';

@Component({
  selector: 'pk-month-view',
  imports: [],
  templateUrl: './month-view.html',
  styleUrl: './month-view.css',
})
export class MonthView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();

  cells = computed(() => {
    const period = this.period();

    const daysInMonth = this._adapter.getNumDaysInMonth(period);
    const dateNames = this._adapter.getDateNames();

    const cells: DateCell[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      // Use localized date names when available; fallback to numeric string.
      const display = dateNames[day - 1];
      cells.push({ value: day, displayValue: display });
    }

    return cells;
  });
}
