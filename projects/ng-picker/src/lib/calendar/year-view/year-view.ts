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
}
