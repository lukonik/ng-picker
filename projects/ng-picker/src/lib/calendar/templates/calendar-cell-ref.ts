import { Directive, inject, TemplateRef } from '@angular/core';
import { CalendarCellRefContext } from '../../types/ng-picker.types';

@Directive({
  selector: 'ng-template[pkCalendarCellRef]',
})
export class CalendarCellRef {
  tempRef = inject<TemplateRef<CalendarCellRefContext>>(TemplateRef);
}
