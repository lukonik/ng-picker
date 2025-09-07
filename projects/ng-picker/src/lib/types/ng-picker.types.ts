export type ViewTypes = 'month' | 'year' | 'multi-year';

export type DatepickerMode = 'single' | 'multi' | 'range';

export interface DateCell<D> {
  value: number;
  displayValue: string;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  date: D;
  empty: boolean;
  isDisabled: boolean;
}

export interface CalendarCellRefContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $implicit: DateCell<any>;
}

export type DatepickerValue<D> = D | null | D[] | { start: D | null; end: D | null };

export type FilterDate<D> = (date: D) => boolean;
