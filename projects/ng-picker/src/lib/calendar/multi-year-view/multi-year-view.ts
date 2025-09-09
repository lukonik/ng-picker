import { Component, computed, inject, input, output } from '@angular/core';
import { DateAdapter } from '../../adapters/date-adapter';
import { CalendarNavIcon } from '../calendar-nav-icon/calendar-nav-icon';

@Component({
  selector: 'pk-multi-year-view',
  imports: [CalendarNavIcon, CalendarNavIcon],
  templateUrl: './multi-year-view.html',
})
export class MultiYearView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();
  selectYear = output<number>();
  goToNextDecade = output<void>();
  goToPrevDecade = output<void>();

  // Selected year corresponds to the current period's year
  selectedYear = computed(() => this._adapter.getYear(this.period()));
  // Today's calendar year for subtle highlight
  todayYear = computed(() => this._adapter.getYear(this._adapter.today()));

  yearRanges = computed(() => {
    const fromYear = this.fromYear();
    const toYear = this.toYear();
    const years = [];
    for (let i = fromYear; i <= toYear; i++) {
      years.push(i);
    }
    return years;
  });

  fromYear = computed(() => {
    const year = this._adapter.getYear(this.period());
    return Math.floor(year / 10) * 10;
  });

  toYear = computed(() => {
    const year = this._adapter.getYear(this.period());
    return Math.floor(year / 10) * 10 + 9;
  });
}
