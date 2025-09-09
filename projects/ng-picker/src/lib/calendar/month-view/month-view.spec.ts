import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';

import { MonthView } from './month-view';
import { DateAdapter } from '../../adapters/date-adapter';
import { NativeDateAdapter } from '../../adapters/native-date-adapter';
import { DatepickerUtils } from '../../services/datepicker-utils';
import { DateCell } from '../../types/ng-picker.types';

describe('MonthView', () => {
  let fixture: ComponentFixture<MonthView<Date>>;
  let component: MonthView<Date>;
  let adapter: DateAdapter<Date>;

  function setRequiredInputs(opts: {
    period: Date;
    today: Date;
    value: any;
    mode: 'single' | 'multi' | 'range';
    disablePast?: boolean;
    disableFuture?: boolean;
    disableToday?: boolean;
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
  }) {
    fixture.componentRef.setInput('period', opts.period);
    fixture.componentRef.setInput('today', opts.today);
    fixture.componentRef.setInput('value', opts.value);
    fixture.componentRef.setInput('mode', opts.mode);
    fixture.componentRef.setInput('disablePast', opts.disablePast ?? false);
    fixture.componentRef.setInput('disableFuture', opts.disableFuture ?? false);
    fixture.componentRef.setInput('disableToday', opts.disableToday ?? false);
    if (opts.minDate !== undefined) fixture.componentRef.setInput('minDate', opts.minDate);
    if (opts.maxDate !== undefined) fixture.componentRef.setInput('maxDate', opts.maxDate);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthView],
      providers: [
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: DateAdapter, useClass: NativeDateAdapter },
        DatepickerUtils,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthView<Date>);
    component = fixture.componentInstance;
    adapter = TestBed.inject(DateAdapter<Date>);
  });

  it('should create', () => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1); // Mar 2024
    const today = adapter.createDate(2024, 2, 15);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('renders current month and year in header', () => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1); // March 2024
    const today = adapter.createDate(2024, 2, 15);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const monthBtn = host.querySelector(
      '.pk-picker-calendar-month-header-current-year',
    ) as HTMLButtonElement; // shows month label
    const yearBtn = host.querySelector(
      '.pk-picker-calendar-month-header-current-month',
    ) as HTMLButtonElement; // shows year label

    // Assert (month label is on the "year" class button per template)
    expect(monthBtn.textContent?.trim()).toBe('March');
    expect(yearBtn.textContent?.trim()).toBe('2024');
  });

  it('reorders weekdays based on first day of week', () => {
    // Arrange: Monday as first day
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(1);
    const period = adapter.createDate(2024, 1, 1); // Feb 2024
    const today = adapter.createDate(2024, 1, 1);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const ths = Array.from(host.querySelectorAll('thead th.pk-picker-weekday-cell')) as HTMLTableCellElement[];
    const short = adapter.getDayOfWeekNames('short');

    // Assert: first should be index 1 (Monday), last should be index 0 (Sunday)
    expect(ths.length).toBe(7);
    expect(ths[0].textContent?.trim()).toBe(short[1]);
    expect(ths[6].textContent?.trim()).toBe(short[0]);
  });

  it('computes correct number of day cells for the month', () => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 1, 1); // Feb 2024 (leap year)
    const today = adapter.createDate(2024, 1, 10);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const dayButtons = host.querySelectorAll('button.pk-day-cell');

    // Assert
    expect(dayButtons.length).toBe(adapter.getNumDaysInMonth(period)); // 29 in 2024
  });

  it('emits selectDate when a day is clicked (enabled cell)', (done) => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1); // March 2024
    const today = adapter.createDate(2024, 2, 15);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    component.selectDate.subscribe((cell: DateCell<Date>) => {
      try {
        expect(cell.value).toBe(1);
        expect(adapter.sameDate(cell.date, adapter.setDate(period, 1))).toBeTrue();
        done();
      } catch (e) {
        fail(e as Error);
        done();
      }
    });

    // Act
    fixture.detectChanges();
    const firstDayBtn = Array.from(host.querySelectorAll('button.pk-day-cell')).find(
      (b) => (b as HTMLButtonElement).textContent?.trim() === '1',
    ) as HTMLButtonElement;
    firstDayBtn.click();
  });

  it('disables past/future/today based on flags', () => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1); // March 2024
    const today = adapter.createDate(2024, 2, 15);
    setRequiredInputs({
      period,
      today,
      value: null,
      mode: 'single',
      disablePast: true,
      disableFuture: true,
      disableToday: true,
    });

    // Act
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const getBtn = (label: string) =>
      Array.from(host.querySelectorAll('button.pk-day-cell')).find(
        (b) => (b as HTMLButtonElement).textContent?.trim() === label,
      ) as HTMLButtonElement;

    const prevBtn = getBtn('10'); // past
    const todayBtn = getBtn('15'); // today
    const futureBtn = getBtn('20'); // future

    // Assert
    expect(prevBtn.disabled).toBeTrue();
    expect(todayBtn.disabled).toBeTrue();
    expect(futureBtn.disabled).toBeTrue();
  });

  it('applies classes for selected and in-range (range mode)', () => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1); // March 2024
    const today = adapter.createDate(2024, 2, 1);
    const start = adapter.setDate(period, 5);
    const end = adapter.setDate(period, 10);
    setRequiredInputs({ period, today, value: { start, end }, mode: 'range' });

    // Act
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const day = (n: number) =>
      Array.from(host.querySelectorAll('button.pk-day-cell')).find(
        (b) => (b as HTMLButtonElement).textContent?.trim() === String(n),
      ) as HTMLButtonElement;

    const d5 = day(5);
    const d7 = day(7);
    const d10 = day(10);

    // Assert
    expect(d5.classList.contains('pk-day-cell-selected')).toBeTrue(); // endpoint
    expect(d7.classList.contains('pk-day-cell-in-range')).toBeTrue(); // between
    expect(d10.classList.contains('pk-day-cell-selected')).toBeTrue(); // endpoint
  });

  it('computes weekCells with correct leading and trailing pads', () => {
    // Arrange: March 2024 starts on Friday; with Sunday=0 first day → leadingPad=5
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1);
    const today = adapter.createDate(2024, 2, 1);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    fixture.detectChanges();
    // No DOM needed; use computed directly
    const weeks = component.weekCells();

    // Assert
    expect(weeks.length).toBe(6);
    expect(weeks[0].startPad).toBe(5);
    expect(weeks[weeks.length - 1].endPad).toBe(6);
  });

  it('startPad and endPad generate adjacent month display values', () => {
    // Arrange: March 2024 → previous month Feb 2024 has 29 days (leap year)
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1);
    const today = adapter.createDate(2024, 2, 1);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    // Act
    const start = component.startPad(5).map((p) => p.displayValue);
    const end = component.endPad(2).map((p) => p.displayValue);

    // Assert
    expect(start).toEqual(['25', '26', '27', '28', '29']);
    expect(end).toEqual(['1', '2']);
  });

  it('emits navigation and view-change events from header buttons', (done) => {
    // Arrange
    spyOn(adapter, 'getFirstDayOfWeek').and.returnValue(0);
    const period = adapter.createDate(2024, 2, 1);
    const today = adapter.createDate(2024, 2, 1);
    setRequiredInputs({ period, today, value: null, mode: 'single' });

    const host: HTMLElement = fixture.nativeElement as HTMLElement;

    let next = false;
    let prev = false;
    let year = false;
    let multiYear = false;

    component.goToNextMonth.subscribe(() => (next = true));
    component.goToPrevMonth.subscribe(() => (prev = true));
    component.changeView.subscribe((v) => {
      if (v === 'year') year = true;
      if (v === 'multi-year') multiYear = true;
    });

    // Act
    fixture.detectChanges();
    const navs = host.querySelectorAll('button.pk-picker-calendar-nav');
    const prevBtn = navs[0] as HTMLButtonElement;
    const nextBtn = navs[1] as HTMLButtonElement;
    const monthBtn = host.querySelector(
      '.pk-picker-calendar-month-header-current-year',
    ) as HTMLButtonElement; // emits 'year'
    const yearBtn = host.querySelector(
      '.pk-picker-calendar-month-header-current-month',
    ) as HTMLButtonElement; // emits 'multi-year'

    prevBtn.click();
    nextBtn.click();
    monthBtn.click();
    yearBtn.click();

    // Assert
    setTimeout(() => {
      try {
        expect(prev).toBeTrue();
        expect(next).toBeTrue();
        expect(year).toBeTrue();
        expect(multiYear).toBeTrue();
        done();
      } catch (e) {
        fail(e as Error);
        done();
      }
    }, 0);
  });
});
