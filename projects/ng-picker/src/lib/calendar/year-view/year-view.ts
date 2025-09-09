import { Component, computed, inject, input, output } from '@angular/core';
import { DateAdapter } from '../../adapters/date-adapter';
import { ViewTypes } from '../../types/ng-picker.types';

@Component({
  selector: 'pk-year-view',
  imports: [],
  templateUrl: './year-view.html',
})
export class YearView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();

  changeView = output<ViewTypes>();

  currentYear = computed(() => {
    return this._adapter.getYear(this.period());
  });

  months = computed(() => {
    return this._adapter.getMonthNames('short').map((name, index) => ({
      name,
      index,
    }));
  });

  // Selected month is taken from the current period
  selectedMonth = computed(() => this._adapter.getMonth(this.period()));
  // Today helpers for subtle highlight when viewing the current year
  todayYear = computed(() => this._adapter.getYear(this._adapter.today()));
  todayMonth = computed(() => this._adapter.getMonth(this._adapter.today()));
}
