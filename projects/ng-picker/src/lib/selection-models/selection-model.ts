import { DateAdapter } from '../adapters/date-adapter';
import { DpDateFormats } from '../adapters/date-formats';
import { DatepickerValue, SelectionMode } from '../models/datepicker-types';

export abstract class SelectionModel<D> {
  constructor(
    protected adapter: DateAdapter<D>,
    protected dateFormats: DpDateFormats
  ) {}
  abstract selectDate(value: D): void;
  abstract display(): string;
  abstract getValue(): DatepickerValue<D> | null;
}
