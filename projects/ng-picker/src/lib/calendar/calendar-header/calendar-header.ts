import { Component, computed, inject, input, output } from '@angular/core';
import { DateAdapter } from '../../adapters/date-adapter';
import { ViewTypes } from '../../types/ng-picker.types';

@Component({
  selector: 'pk-calendar-header',
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.css',
})
export class CalendarHeader<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  view = input.required<ViewTypes>();
  period = input.required<D>();
  changeView = output<ViewTypes>();
  selectYear = output<number>();

  currentMonth = computed(() => {
    const month = this._adapter.getMonth(this.period());
    return this._adapter.getMonthNames('long')[month];
  });

  currentYear = computed(() => {
    return this._adapter.getYear(this.period());
  });
}
