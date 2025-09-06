import { Component, inject, input, output, signal } from '@angular/core';
import { DateAdapter } from '../adapters/date-adapter';
import { DateCell, DatepickerMode, DatepickerValue, ViewTypes } from '../types/ng-picker.types';
import { MonthView } from './month-view/month-view';
import { CalendarCellRef } from './templates/calendar-cell-ref';

@Component({
  selector: 'pk-calendar',
  imports: [MonthView],
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
  minDate = input.required<D>();
  maxDate = input.required<D>();

  view = signal<ViewTypes>(ViewTypes.Month);
  period = signal<D>(this._adapter.today());
  today = signal<D>(this._adapter.today());
  calendarCellRef = input<CalendarCellRef>();
}
