import { Directive, inject, TemplateRef } from '@angular/core';
import { CalendarCellRefContext } from '../../types/ng-picker.types';

@Directive({
  selector: 'ng-template[pkCalendarCellRef]',
})
export class CalendarCellRef {
  tempRef = inject<TemplateRef<CalendarCellRefContext>>(TemplateRef);

  static ngTemplateContextGuard<T>(_dir: CalendarCellRef, ctx: any): ctx is CalendarCellRefContext {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
