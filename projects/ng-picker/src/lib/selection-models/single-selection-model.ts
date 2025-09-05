import { signal } from '@angular/core';
import { SelectionModel } from './selection-model';
import { DatepickerValue } from '../models/datepicker-types';

export class SingleSelectionModel<D> extends SelectionModel<D> {
  private _value = signal<D | null>(null);
  override display(): string {
    return 'HELLO';
  }

  override selectDate(value: D): void {
    this._value.set(value);
  }

  override getValue(): DatepickerValue<D> | null {
    return this._value();
  }
}
