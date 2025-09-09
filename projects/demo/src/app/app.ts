import { Component, inject, signal } from '@angular/core';
import { DateAdapter } from '../../../ng-picker/src/lib/adapters/date-adapter';
import { Datepicker, Toggle } from '../../../ng-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [Datepicker, Toggle],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  today = inject(DateAdapter).today();
}
