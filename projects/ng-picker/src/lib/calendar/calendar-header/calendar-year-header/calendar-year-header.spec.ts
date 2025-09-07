import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarYearHeader } from './calendar-year-header';

describe('CalendarYearHeader', () => {
  let component: CalendarYearHeader;
  let fixture: ComponentFixture<CalendarYearHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarYearHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarYearHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
