import {
  booleanAttribute,
  Component,
  contentChild,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Calendar } from '../calendar/calendar';
import { CalendarCellRef } from '../calendar/templates/calendar-cell-ref';
import { DatepickerUtils } from '../services/datepicker-utils';
import { DateCell, DatepickerMode, DatepickerValue, FilterDate } from '../types/ng-picker.types';

@Component({
  selector: 'pk-datepicker',
  imports: [Calendar],
  templateUrl: './datepicker.html',
  providers: [DatepickerUtils],
  host: {
    class: 'pk-datepicker',
  },
})
export class Datepicker<D> {
  private _datepickerUtils = inject<DatepickerUtils>(DatepickerUtils);

  value = signal<DatepickerValue<D>>(null);
  mode = input<DatepickerMode>('single');
  calendarCellRef = contentChild(CalendarCellRef);

  disablePast = input(false, { transform: booleanAttribute });
  disableFuture = input(false, { transform: booleanAttribute });
  disableToday = input(false, { transform: booleanAttribute });
  minDate = input<D>();
  maxDate = input<D>();
  filterDate = input<FilterDate<D>>();

  constructor() {
    effect(() => {
      console.log(this.value());
    });
  }

  selectDate(cell: DateCell<D>) {
    this.value.set(this._datepickerUtils.selectDate(cell.date, this.value(), this.mode()));
  }
}
