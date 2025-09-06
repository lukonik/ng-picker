import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DateAdapter } from '../../../ng-picker/src/lib/adapters/date-adapter';
import { CalendarCellRef, Datepicker } from '../../../ng-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Datepicker, CalendarCellRef],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  today = inject(DateAdapter).today();
}
