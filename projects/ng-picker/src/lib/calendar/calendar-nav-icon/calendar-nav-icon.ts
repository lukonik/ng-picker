import { booleanAttribute, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pk-calendar-nav-icon',
  imports: [],
  templateUrl: './calendar-nav-icon.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'pk-picker-calendar-nav-icon',
  },
})
export class CalendarNavIcon {
  prev = input(false, { transform: booleanAttribute });
}
