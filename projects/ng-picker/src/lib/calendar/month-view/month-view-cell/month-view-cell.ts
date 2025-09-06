import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { DateCell } from '../../../types/ng-picker.types';
import { CalendarCellRef } from '../../templates/calendar-cell-ref';

@Component({
  selector: 'pk-month-view-cell',
  imports: [NgTemplateOutlet],
  templateUrl: './month-view-cell.html',
  styleUrl: './month-view-cell.css',
})
export class MonthViewCell<D> {
  cell = input.required<DateCell<D>>();
  calendarCellRef = input<CalendarCellRef>();
  selectDate = output<DateCell<D>>();
}
