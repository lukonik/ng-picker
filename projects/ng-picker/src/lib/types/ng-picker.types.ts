export enum ViewTypes {
  Month = 'month',
  Year = 'year',
  MultiYear = 'multi-year',
}

export interface DateCell {
  value: number;
  displayValue: string;
  isToday: boolean;
}

export interface CalendarCellRefContext {
  $implicit: DateCell;
}
