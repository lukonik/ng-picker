import { Component, inject, signal } from '@angular/core';
import { ViewTypes } from '../types/ng-picker.types';
import { MonthView } from './month-view/month-view';
import { DateAdapter } from '../adapters/date-adapter';

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
}
