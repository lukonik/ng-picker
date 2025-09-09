import { afterRenderEffect, booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Datepicker } from './datepicker/datepicker';

@Directive({
  selector: 'input[pkDatepickerInput]',
  host: {
    '(click)': 'onClick()',
    '[value]': 'value()',
    '(change)': 'onChange()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DatepickerInput,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: DatepickerInput,
      multi: true,
    },
  ],
})
export class DatepickerInput<D> implements ControlValueAccessor, Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onChange: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onTouched: any;
  private _el = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  for = input.required<Datepicker<D>>({ alias: 'pkDatepickerInput' });
  value = computed(() => this.for().displayValue());
  required = input(false, { transform: booleanAttribute });

  constructor() {
    afterRenderEffect(() => {
      this.for().valueChange.subscribe(() => {
        this._onChange(this.for().value());
        this._onTouched();
      });
    });
  }

  onClick() {
    this.for().open(this._el);
  }

  onChange() {
    this.for().parse(this._el.value);
  }

  writeValue(value: Parameters<Datepicker<D>['parse']>[0]): void {
    this.for().parse(value);
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.required()) return null;
    const mode = this.for().mode();
    const v = this.for().value();
    if (v == null) return { required: true };
    if (mode === 'multi') {
      return Array.isArray(v) && v.length > 0 ? null : { required: true };
    }
    if (mode === 'range') {
      if (Array.isArray(v) || v == null) return { required: true };
      const r = v as { start: unknown; end: unknown };
      return r.start && r.end ? null : { required: true };
    }
    // single
    return v ? null : { required: true };
  }
}
