import { inject, Injectable } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import { DatepickerMode, DatepickerValue, FilterDate } from '../types/ng-picker.types';

@Injectable()
export class DatepickerUtils {
  private _adapter = inject<DateAdapter<unknown>>(DateAdapter);

  isSelected<D>(date: D, value: DatepickerValue<D>, mode: DatepickerMode): boolean {
    switch (mode) {
      case 'single':
        return this.isSelectedInSingle(date, value);
      case 'multi':
        return this.isSelectedInMulti(date, value);
      case 'range':
        return this.isSelectedInRange(date, value);
    }
  }

  private isSelectedInMulti<D>(date: D, value: DatepickerValue<D>) {
    if (Array.isArray(value)) {
      const arr = value as D[];
      return arr.some((v) => this._adapter.sameDate(date, v));
    }
    return false;
  }

  private isSelectedInSingle<D>(date: D, value: DatepickerValue<D>) {
    return value != null && this._adapter.sameDate(date, value as D);
  }

  private isSelectedInRange<D>(date: D, value: DatepickerValue<D>) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const range = value as { start: D | null; end: D | null };
      const isStart = !!range.start && this._adapter.sameDate(date, range.start);
      const isEnd = !!range.end && this._adapter.sameDate(date, range.end);
      return isStart || isEnd;
    }
    return false;
  }

  selectDate<D>(date: D, value: DatepickerValue<D>, mode: DatepickerMode): DatepickerValue<D> {
    switch (mode) {
      case 'single':
        return this.selectDateInSingle(date);
      case 'multi':
        return this.selectDateInMulti(date, value);
      case 'range':
        return this.selectDateInRange(date, value);
      default:
        return value;
    }
  }

  private selectDateInMulti<D>(date: D, value: DatepickerValue<D>): D[] {
    const current = Array.isArray(value) ? (value as D[]) : [];
    const exists = current.some((v) => this._adapter.sameDate(v, date));
    if (exists) {
      return current.filter((v) => !this._adapter.sameDate(v, date));
    }
    return [...current, date];
  }

  private selectDateInSingle<D>(date: D): D {
    return date;
  }

  private selectDateInRange<D>(
    date: D,
    value: DatepickerValue<D>,
  ): { start: D | null; end: D | null } {
    let start: D | null = null;
    let end: D | null = null;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const v = value as { start: D | null; end: D | null };
      start = v.start ?? null;
      end = v.end ?? null;
    }

    // If a complete range exists or nothing is selected, start a new range with the clicked date
    if ((start && end) || (!start && !end)) {
      return { start: date, end: null };
    }

    // If only start is set, set end; if picked date is before start, reset start
    if (start && !end) {
      const cmp = this._adapter.compareDate(date, start);
      if (cmp < 0) {
        // New click is earlier than start: reset start and keep selecting
        return { start: date, end: null };
      }
      // cmp >= 0: same day or after → make single or forward range
      return { start, end: date };
    }

    // Fallback
    return { start: date, end: null };
  }

  isDateDisabled<D>(
    date: D,
    disablePast: boolean,
    disableFuture: boolean,
    disableToday: boolean,
    today: D,
    min: D | undefined,
    max: D | undefined,
    filterDate: FilterDate<D> | undefined,
  ): boolean {
    // Min/Max boundaries take precedence
    if (min && this._adapter.compareDate(date, min) < 0) {
      return true;
    }
    if (max && this._adapter.compareDate(date, max) > 0) {
      return true;
    }

    // Explicitly disable today if requested
    if (disableToday && this._adapter.sameDate(date, today)) {
      return true;
    }

    // Relative rules based on today
    const rel = this._adapter.compareDate(date, today);
    if (disablePast && rel < 0) {
      return true;
    }
    if (disableFuture && rel > 0) {
      return true;
    }
    // Custom filter predicate: return true to allow, false to disable
    if (filterDate && !filterDate(date)) {
      return true;
    }
    return false;
  }
}
