import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { Grid } from '../../a11y/grid/grid';
import { GridCell } from '../../a11y/grid/grid-cell';
import { GridRow } from '../../a11y/grid/grid-row';
import { DateAdapter } from '../../adapters/date-adapter';
import { DatepickerUtils } from '../../services/datepicker-utils';
import {
  DateCell,
  DatepickerMode,
  DatepickerValue,
  FilterDate,
  ViewTypes,
} from '../../types/ng-picker.types';
import { CalendarCellRef } from '../templates/calendar-cell-ref';

@Component({
  selector: 'pk-month-view',
  imports: [Grid, GridCell, GridRow, NgTemplateOutlet],
  templateUrl: './month-view.html',
  styleUrl: './month-view.css',
})
export class MonthView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  private _datepickerUtils = inject<DatepickerUtils>(DatepickerUtils);

  currentMonth = computed(() => {
    const month = this._adapter.getMonth(this.period());
    return this._adapter.getMonthNames('long')[month];
  });

  currentYear = computed(() => {
    return this._adapter.getYear(this.period());
  });

  period = input.required<D>();
  today = input.required<D>();
  value = input.required<DatepickerValue<D>>();
  mode = input.required<DatepickerMode>();
  calendarCellRef = input<CalendarCellRef>();
  disablePast = input.required<boolean>();
  disableFuture = input.required<boolean>();
  disableToday = input.required<boolean>();
  minDate = input<D>();
  maxDate = input<D>();
  filterDate = input<FilterDate<D>>();

  selectDate = output<DateCell<D>>();
  changeView = output<ViewTypes>();
  goToNextMonth = output<void>();
  goToPrevMonth = output<void>();

  weekDays = computed(() => {
    const short = this._adapter.getDayOfWeekNames('short');
    const long = this._adapter.getDayOfWeekNames('long');
    const first = this._adapter.getFirstDayOfWeek();
    const reorder = <T>(arr: T[]) => [...arr.slice(first), ...arr.slice(0, first)];
    const rShort = reorder(short);
    const rLong = reorder(long);
    return rShort.map((s, i) => ({ short: s, long: rLong[i] }));
  });

  cells = computed(() => {
    const period = this.period();

    const daysInMonth = this._adapter.getNumDaysInMonth(period);
    const dateNames = this._adapter.getDateNames();

    const cells: DateCell<D>[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      // Use localized date names when available; fallback to numeric string.
      const display = dateNames[day - 1];
      const date = this._adapter.setDate(period, day);
      const isToday = this._adapter.sameDate(date, this.today());
      cells.push({
        value: day,
        displayValue: display,
        isToday: isToday,
        isInRange: this._datepickerUtils.isInRange(date, this.value(), this.mode()),
        isSelected: this._datepickerUtils.isSelected(date, this.value(), this.mode()),
        date: date,
        empty: false,
        isDisabled: this._datepickerUtils.isDateDisabled(
          date,
          this.disablePast(),
          this.disableFuture(),
          this.disableToday(),
          this.today(),
          this.minDate(),
          this.maxDate(),
          this.filterDate(),
        ),
      });
    }

    return cells;
  });

  // Helper for template loops over pad counts
  pad(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  weekCells = computed(() => {
    const period = this.period();
    const monthCells = this.cells();

    // Determine leading pad for the first week based on locale first day
    const firstDayOfWeek = this._adapter.getFirstDayOfWeek();
    const firstOfMonth = this._adapter.createDate(
      this._adapter.getYear(period),
      this._adapter.getMonth(period),
      1,
    );
    const firstDow = this._adapter.getDayOfWeek(firstOfMonth);
    const leadingPad = (7 + firstDow - firstDayOfWeek) % 7;

    const result: { startPad: number; cells: DateCell<D>[]; endPad: number }[] = [];
    const totalWithPad = leadingPad + monthCells.length;
    const weekCount = Math.ceil(totalWithPad / 7);

    let idx = 0;
    for (let w = 0; w < weekCount; w++) {
      const startPad = w === 0 ? leadingPad : 0;
      const capacity = 7 - startPad;
      const slice = monthCells.slice(idx, idx + capacity);
      idx += slice.length;

      const isLast = w === weekCount - 1;
      const endPad = isLast ? Math.max(0, 7 - (startPad + slice.length)) : 0;

      result.push({ startPad, cells: slice, endPad });
    }

    return result;
  });
}
