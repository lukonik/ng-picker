import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMultiYearHeader } from './calendar-multi-year-header';

describe('CalendarMultiYearHeader', () => {
  let component: CalendarMultiYearHeader;
  let fixture: ComponentFixture<CalendarMultiYearHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarMultiYearHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarMultiYearHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
