export enum ViewTypes {
  Month = 'month',
  Year = 'year',
  MultiYear = 'multi-year',
}

export enum DatepickerMode {
  Single = 'single',
}

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
