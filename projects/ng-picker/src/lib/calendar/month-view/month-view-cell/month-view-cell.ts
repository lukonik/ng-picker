import { Component, input, TemplateRef } from '@angular/core';
import { DateCell } from '../../../types/ng-picker.types';
import { NgTemplateOutlet } from '@angular/common';
import { CalendarCellRef } from '../../templates/calendar-cell-ref';

@Component({
  selector: 'pk-month-view-cell',
  imports: [NgTemplateOutlet],
  templateUrl: './month-view-cell.html',
  styleUrl: './month-view-cell.css',
})
export class MonthViewCell {
  cell = input.required<DateCell>();
  calendarCellRef = input<CalendarCellRef>();
}
