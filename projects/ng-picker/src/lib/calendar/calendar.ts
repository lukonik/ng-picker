import { Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import {
  DateCell,
  DatepickerMode,
  DatepickerValue,
  FilterDate,
  ViewTypes,
} from '../types/ng-picker.types';
import { MonthView } from './month-view/month-view';
import { MultiYearView } from './multi-year-view/multi-year-view';
import { CalendarCellRef } from './templates/calendar-cell-ref';
import { YearView } from './year-view/year-view';

@Component({
  selector: 'pk-calendar',
  imports: [MonthView, YearView, MultiYearView],
  templateUrl: './calendar.html',
})
export class Calendar<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);

  selectDate = output<DateCell<D>>();

  startView = input<ViewTypes, ViewTypes>('month', {
    transform: (value: ViewTypes) => {
      this.view.set(value);
      return value;
    },
  });
  value = input.required<DatepickerValue<D>>();
  mode = input.required<DatepickerMode>();
  disablePast = input.required<boolean>();
  disableFuture = input.required<boolean>();
  disableToday = input.required<boolean>();
  minDate = input<D>();
  maxDate = input<D>();
  filterDate = input<FilterDate<D>>();

  view = signal<ViewTypes>('multi-year');
  // Period is linked to the current value when present; otherwise defaults to today.
  // - single: uses the single date value
  // - range: prefers start, then end
  // - multi: uses the first selected date
  period = linkedSignal<D>(() => {
    const v = this.value();
    if (Array.isArray(v)) {
      const first = (v as D[])[0];
      return first ?? this._adapter.today();
    }
    if (v != null && this._adapter.isDateInstance(v)) {
      return v as D;
    }
    if (v && typeof v === 'object') {
      const r = v as { start: D | null; end: D | null };
      return r.start ?? r.end ?? this._adapter.today();
    }
    return this._adapter.today();
  });
  today = signal<D>(this._adapter.today());
  calendarCellRef = input<CalendarCellRef>();

  goToNextMonth() {
    const next = this._adapter.addCalendarMonths(this.period(), 1);
    this.period.set(next);
  }
  goToPrevMonth() {
    const prev = this._adapter.addCalendarMonths(this.period(), -1);
    this.period.set(prev);
  }

  changeView(view: ViewTypes) {
    this.view.set(view);
  }

  selectYear(year: number) {
    const currentMonth = this._adapter.getMonth(this.period());
    const newDate = this._adapter.createDate(year, currentMonth, 1);
    this.period.set(newDate);
    this.view.set('year');
  }

  selectMonth(month: number) {
    const year = this._adapter.getYear(this.period());
    const newDate = this._adapter.createDate(year, month, 1);
    this.period.set(newDate);
    this.view.set('month');
  }

  goToNextDecade() {
    const next = this._adapter.addCalendarYears(this.period(), 10);
    this.period.set(next);
  }
  goToPrevDecade() {
    const prev = this._adapter.addCalendarYears(this.period(), -10);
    this.period.set(prev);
  }
}
