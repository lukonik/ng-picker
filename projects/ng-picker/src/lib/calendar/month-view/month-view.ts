import { Component, computed, inject, input } from '@angular/core';
import { DateCell } from '../../types/ng-picker.types';
import { DateAdapter } from '../../adapters/date-adapter';

@Component({
  selector: 'pk-month-view',
  imports: [],
  templateUrl: './month-view.html',
  styleUrl: './month-view.css',
})
export class MonthView<D> {
  private _adapter = inject<DateAdapter<D>>(DateAdapter);
  period = input.required<D>();

  cells = computed(() => {
    const cells: DateCell[] = [];
  });
}
