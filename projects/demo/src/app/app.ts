import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarCellRef, Datepicker } from '../../../ng-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Datepicker, CalendarCellRef],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
}
