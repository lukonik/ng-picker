import { DateAdapter } from '../adapters/date-adapter';
import { DpDateFormats } from '../adapters/date-formats';
import { SelectionMode } from '../models/datepicker-types';
import { SingleSelectionModel } from './single-selection-model';

export function getSelectionModel<D>(
  mode: SelectionMode,
  adapter: DateAdapter<D>,
  dateFormats: DpDateFormats
) {
  switch (mode) {
    case 'single':
      return new SingleSelectionModel<D>(adapter, dateFormats);
    default:
      throw new Error(`Unsupported selection mode: ${mode}`);
  }
}
