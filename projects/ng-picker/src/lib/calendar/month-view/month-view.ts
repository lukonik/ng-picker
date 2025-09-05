import { Component, computed, inject, input } from '@angular/core';
import { DateAdapter } from '../../adapters/date-adapter';
import { DateCell } from '../../types/ng-picker.types';
import { CalendarCellRef } from '../templates/calendar-cell-ref';
import { MonthViewCell } from './month-view-cell/month-view-cell';

@Component({
  selector: 'pk-month-view',
  imports: [MonthViewCell],
  templateUrl: './month-view.html',
  styleUrl: './month-view.css',
})
export class MonthView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();
  today = input.required<D>();
  calendarCellRef = input<CalendarCellRef>();

  weekDays = computed(() => {
    const names = this._adapter.getDayOfWeekNames('short');
    const first = this._adapter.getFirstDayOfWeek();
    // Reorder weekday names to start from locale's first day
    return [...names.slice(first), ...names.slice(0, first)];
  });

  cells = computed(() => {
    const period = this.period();

    const daysInMonth = this._adapter.getNumDaysInMonth(period);
    const dateNames = this._adapter.getDateNames();

    const cells: DateCell[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      // Use localized date names when available; fallback to numeric string.
      const display = dateNames[day - 1];
      const date = this._adapter.setDate(period, day);
      const isToday = this._adapter.sameDate(date, this.today());
      cells.push({ value: day, displayValue: display, isToday: isToday });
    }

    return cells;
  });

  weekCells = computed(() => {
    const period = this.period();
    const cells = this.cells();

    // Determine how many blanks to pad before the 1st of the month
    const firstDayOfWeek = this._adapter.getFirstDayOfWeek();
    const firstOfMonth = this._adapter.createDate(
      this._adapter.getYear(period),
      this._adapter.getMonth(period),
      1,
    );
    const firstDow = this._adapter.getDayOfWeek(firstOfMonth);
    const leadingBlanks = (7 + firstDow - firstDayOfWeek) % 7;

    const blankCell: DateCell = { value: -1, displayValue: '', isToday: false };
    const paddedStart: DateCell[] = Array.from({ length: leadingBlanks }, () => blankCell);
    const startPadded = [...paddedStart, ...cells];

    // Pad the end so the total count is a multiple of 7
    const trailingBlanks = (7 - (startPadded.length % 7)) % 7;
    const paddedEnd: DateCell[] = Array.from({ length: trailingBlanks }, () => blankCell);
    const full = [...startPadded, ...paddedEnd];

    // Chunk into weeks (rows of 7)
    const weeks: DateCell[][] = [];
    for (let i = 0; i < full.length; i += 7) {
      weeks.push(full.slice(i, i + 7));
    }

    return weeks;
  });
}
