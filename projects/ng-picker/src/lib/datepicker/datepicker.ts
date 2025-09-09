import {
  Overlay,
  OverlayModule,
  OverlayRef,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from '@angular/cdk/overlay';
import { CdkPortal, CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { Calendar } from '../calendar/calendar';
import { CalendarCellRef } from '../calendar/templates/calendar-cell-ref';
import { DatepickerUtils } from '../services/datepicker-utils';
import { DateAdapter } from '../adapters/date-adapter';
import {
  DateCell,
  DatepickerMode,
  DatepickerValue,
  FilterDate,
  ViewTypes,
} from '../types/ng-picker.types';

@Component({
  selector: 'pk-datepicker',
  imports: [Calendar, OverlayModule, PortalModule, CdkPortal, CdkPortalOutlet],
  templateUrl: './datepicker.html',
  providers: [DatepickerUtils],
  host: {
    class: 'pk-picker-datepicker',
  },
})
export class Datepicker<D> {
  private _datepickerUtils = inject<DatepickerUtils<D>>(DatepickerUtils);
  private _overlay = inject(Overlay);
  private _adapter = inject<DateAdapter<D>>(DateAdapter);

  inline = input(false);
  portal = viewChild.required<CdkPortal>('pickerPortal');
  overlayRef = signal<OverlayRef | null>(null);
  value = model<DatepickerValue<D>>(null);
  displayValue = computed<string>(() =>
    this._datepickerUtils.getDisplayValue(this.value(), this.mode()),
  );
  mode = input<DatepickerMode>('single');
  startView = input<ViewTypes>('month');
  calendarCellRef = contentChild(CalendarCellRef);

  disablePast = input(false, { transform: booleanAttribute });
  disableFuture = input(false, { transform: booleanAttribute });
  disableToday = input(false, { transform: booleanAttribute });
  minDate = input<D>();
  maxDate = input<D>();
  filterDate = input<FilterDate<D>>();

  selectDate(cell: DateCell<D>) {
    const next = this._datepickerUtils.selectDate(cell.date, this.value(), this.mode());
    this.value.set(next);

    const mode = this.mode();
    if (mode === 'single') {
      this.close();
    } else if (mode === 'range') {
      if (next && typeof next === 'object' && !Array.isArray(next)) {
        const range = next as { start: D | null; end: D | null };
        if (range.start && range.end) {
          this.close();
        }
      }
    }
  }

  open(origin?: HTMLElement) {
    if (this.inline()) return;
    if (!origin) return;

    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(STANDARD_DROPDOWN_BELOW_POSITIONS)
      .withFlexibleDimensions(false)
      .withPush(true);

    const ref = this._overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      panelClass: ['pk-picker-datepicker'],
    });

    ref.backdropClick().subscribe(() => this.close());
    ref.keydownEvents().subscribe((e) => {
      if (e.key === 'Escape') this.close();
    });

    ref.attach(this.portal());
    this.overlayRef.set(ref);
  }

  close() {
    const ref = this.overlayRef();
    if (ref) {
      ref.detach();
      ref.dispose();
      this.overlayRef.set(null);
    }
  }

  parse(input: string) {
    const mode = this.mode();
    if (mode !== 'single') {
      // For now only single-mode parsing is supported from text input.
      this.value.set(null);
      return;
    }
    const parsed = this._adapter.parse(input, undefined);
    if (parsed && this._adapter.isValid(parsed)) {
      this.value.set(parsed as DatepickerValue<D>);
    } else {
      this.value.set(null);
    }
  }
}
