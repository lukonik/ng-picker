import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '../../../ng-picker/src/lib/adapters/date-adapter';
import { Datepicker, DatepickerInput, Toggle } from '../../../ng-picker/src/public-api';

@Component({
  selector: 'app-root',
  imports: [Datepicker, Toggle, DatepickerInput, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('demo');
  value = model();
  today = inject<DateAdapter<Date>>(DateAdapter).createDate(2025, 11, 11);

  constructor() {
    effect(() => {
      console.log('UPDATE ', this.value());
    });
  }
}
