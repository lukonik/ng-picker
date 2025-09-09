import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { Datepicker } from './datepicker/datepicker';

@Directive({
  selector: 'input[pkDatepickerInput]',
  host: {
    '(click)': 'onClick()',
    '[value]': 'value()',
    '(change)': 'onChange()',
  },
})
export class DatepickerInput<D> {
  private _el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  for = input.required<Datepicker<D>>({ alias: 'pkDatepickerInput' });
  value = computed(() => this.for().displayValue());

  onClick() {
    this.for().open(this._el);
  }

  onChange() {
    console.log('CHANGE');
    this.for().parse(this._el.value);
  }
}
