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

  inline = input(false);
  portal = viewChild.required<CdkPortal>('pickerPortal');
  overlayRef = signal<OverlayRef | null>(null);
  value = model<DatepickerValue<D>>(null);
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
    this.value.set(this._datepickerUtils.selectDate(cell.date, this.value(), this.mode()));
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
}
