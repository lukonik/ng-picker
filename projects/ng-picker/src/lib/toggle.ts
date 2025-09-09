import { Directive, ElementRef, inject, input } from '@angular/core';
import { Datepicker } from './datepicker/datepicker';

@Directive({
  selector: '[pkToggle]',
  host: {
    '(click)': 'onClick()',
  },
})
export class Toggle<D> {
  private _el = inject<ElementRef<HTMLElement>>(ElementRef);
  for = input.required<Datepicker<D>>({ alias: 'pkToggle' });

  onClick() {
    this.for().open(this._el.nativeElement);
  }
}
