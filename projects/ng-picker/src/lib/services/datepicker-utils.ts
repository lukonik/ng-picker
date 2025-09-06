import { inject, Injectable } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import { DatepickerMode, DatepickerValue } from '../types/ng-picker.types';

@Injectable()
export class DatepickerUtils {
  private _adapter = inject<DateAdapter<unknown>>(DateAdapter);

  isSelected<D>(date: D, value: DatepickerValue<D>, mode: DatepickerMode): boolean {
    return this.isSelectedInSingle(date, value);
  }

  private isSelectedInSingle<D>(date: D, value: DatepickerValue<D>) {
    return value != null && this._adapter.sameDate(date, value as D);
  }

  selectDate<D>(date: D, value: DatepickerValue<D>, mode: DatepickerMode): DatepickerValue<D> {
    return this.selectDateInSingle(date, value);
  }

  private selectDateInSingle<D>(date: D, _value: DatepickerValue<D>): D {
    return date;
  }

  isDateDisabled<D>(
    date: D,
    disablePast: boolean,
    disableFuture: boolean,
    disableToday: boolean,
    today: D,
    min: D | undefined,
    max: D | undefined,
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
    return false;
  }
}
