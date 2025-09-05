import { Component, contentChild } from '@angular/core';
import { Calendar } from '../calendar/calendar';
import { CalendarCellRef } from '../calendar/templates/calendar-cell-ref';

@Component({
  selector: 'pk-datepicker',
  imports: [Calendar],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker {
  calendarCellRef = contentChild(CalendarCellRef);
}
