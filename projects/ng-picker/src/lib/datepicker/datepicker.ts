import { Component } from '@angular/core';
import { Calendar } from '../calendar/calendar';

@Component({
  selector: 'pk-datepicker',
  imports: [Calendar],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.css',
})
export class Datepicker {}
