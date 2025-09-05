import { Component, inject, input, signal, TemplateRef } from '@angular/core';
import { DateCell, ViewTypes } from '../types/ng-picker.types';
import { MonthView } from './month-view/month-view';
import { DateAdapter } from '../adapters/date-adapter';
import { CalendarCellRef } from './templates/calendar-cell-ref';

@Component({
  selector: 'pk-calendar',
  imports: [MonthView],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);

  view = signal<ViewTypes>(ViewTypes.Month);
  period = signal<D>(this._adapter.today());
  today = signal<D>(this._adapter.today());
  calendarCellRef = input<CalendarCellRef>();
}
