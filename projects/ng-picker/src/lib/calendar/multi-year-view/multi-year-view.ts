import { Component, computed, inject, input } from '@angular/core';
import { DateAdapter } from '../../adapters/date-adapter';

@Component({
  selector: 'pk-multi-year-view',
  imports: [],
  templateUrl: './multi-year-view.html',
  styleUrl: './multi-year-view.css',
})
export class MultiYearView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();

  yearRanges = computed(() => {
    const year = this._adapter.getYear(this.period());
    const start = Math.floor(year / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => start + i);
  });
}
