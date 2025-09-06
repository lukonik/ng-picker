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
  styleUrl: './calendar.css',
})
export class Calendar<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);

  selectDate = output<DateCell<D>>();

  value = input.required<DatepickerValue<D>>();
  mode = input.required<DatepickerMode>();
  disablePast = input.required<boolean>();
  disableFuture = input.required<boolean>();
  disableToday = input.required<boolean>();
  minDate = input<D>();
  maxDate = input<D>();
  filterDate = input<FilterDate<D>>();

  view = signal<ViewTypes>('year');
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
}
