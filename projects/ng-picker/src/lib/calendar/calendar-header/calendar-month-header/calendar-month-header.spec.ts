import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonthHeader } from './calendar-month-header';

describe('CalendarMonthHeader', () => {
  let component: CalendarMonthHeader;
  let fixture: ComponentFixture<CalendarMonthHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMonthHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMonthHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
