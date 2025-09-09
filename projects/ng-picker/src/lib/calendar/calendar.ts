import { Component, inject, input, output, signal } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import {
  DateCell,
  DatepickerMode,
  DatepickerValue,
  FilterDate,
  ViewTypes,
} from '../types/ng-picker.types';
import { CalendarHeader } from './calendar-header/calendar-header';
import { MonthView } from './month-view/month-view';
import { MultiYearView } from './multi-year-view/multi-year-view';
import { CalendarCellRef } from './templates/calendar-cell-ref';
import { YearView } from './year-view/year-view';

@Component({
  selector: 'pk-calendar',
  imports: [MonthView, CalendarHeader, YearView, MultiYearView],
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
  period = signal<D>(this._adapter.today());
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
