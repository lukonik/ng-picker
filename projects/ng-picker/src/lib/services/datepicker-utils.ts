import { inject, Injectable } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import { DatepickerMode, DatepickerValue, FilterDate } from '../types/ng-picker.types';

@Injectable()
export class DatepickerUtils<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);

  getDisplayValue(value: DatepickerValue<D>, mode: DatepickerMode): string {
    const fmt: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

    if (!value) return '';

    switch (mode) {
      case 'single': {
        return this._adapter.format(value as D, fmt);
      }
      case 'multi': {
        const arr = Array.isArray(value) ? (value as D[]) : [];
        return arr.map((d) => this._adapter.format(d, fmt)).join(', ');
      }
      case 'range': {
        if (!value || Array.isArray(value) || typeof value !== 'object') return '';
        const { start, end } = value as { start: D | null; end: D | null };
        const s = start ? this._adapter.format(start, fmt) : '';
        const e = end ? this._adapter.format(end, fmt) : '';
        if (s && e) return `${s} – ${e}`;
        if (s && !e) return `${s} –`;
        if (!s && e) return `– ${e}`;
        return '';
      }
    }
  }

  isSelected(date: D, value: DatepickerValue<D>, mode: DatepickerMode): boolean {
    switch (mode) {
      case 'single':
        return this.isSelectedInSingle(date, value);
      case 'multi':
        return this.isSelectedInMulti(date, value);
      case 'range':
        return this.isSelectedInRange(date, value);
    }
  }

  // Returns true only for dates strictly between start and end in range mode.
  // For 'single' and 'multi' modes, always false.
  isInRange(date: D, value: DatepickerValue<D>, mode: DatepickerMode): boolean {
    if (mode !== 'range') {
      return false;
    }
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      return false;
    }
    const { start, end } = value as { start: D | null; end: D | null };
    if (!start || !end) {
      return false;
    }
    // Exclude endpoints; those are handled by isSelectedInRange
    if (this._adapter.sameDate(date, start) || this._adapter.sameDate(date, end)) {
      return false;
    }
    // Ensure correct order even if externally provided out-of-order
    const startFirst = this._adapter.compareDate(start, end) <= 0 ? start : end;
    const endLast = this._adapter.compareDate(start, end) <= 0 ? end : start;
    return (
      this._adapter.compareDate(date, startFirst) > 0 &&
      this._adapter.compareDate(date, endLast) < 0
    );
  }

  private isSelectedInMulti(date: D, value: DatepickerValue<D>) {
    if (Array.isArray(value)) {
      const arr = value as D[];
      return arr.some((v) => this._adapter.sameDate(date, v));
    }
    return false;
  }

  private isSelectedInSingle(date: D, value: DatepickerValue<D>) {
    return value != null && this._adapter.sameDate(date, value as D);
  }

  private isSelectedInRange(date: D, value: DatepickerValue<D>) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const range = value as { start: D | null; end: D | null };
      const isStart = !!range.start && this._adapter.sameDate(date, range.start);
      const isEnd = !!range.end && this._adapter.sameDate(date, range.end);
      return isStart || isEnd;
    }
    return false;
  }

  selectDate(date: D, value: DatepickerValue<D>, mode: DatepickerMode): DatepickerValue<D> {
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

  private selectDateInMulti(date: D, value: DatepickerValue<D>): D[] {
    const current = Array.isArray(value) ? (value as D[]) : [];
    const exists = current.some((v) => this._adapter.sameDate(v, date));
    if (exists) {
      return current.filter((v) => !this._adapter.sameDate(v, date));
    }
    return [...current, date];
  }

  private selectDateInSingle(date: D): D {
    return date;
  }

  private selectDateInRange(
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

  isDateDisabled(
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
