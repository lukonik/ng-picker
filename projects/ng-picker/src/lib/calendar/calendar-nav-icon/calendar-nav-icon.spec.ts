import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNavIcon } from './calendar-nav-icon';

describe('CalendarNavIcon', () => {
  let component: CalendarNavIcon;
  let fixture: ComponentFixture<CalendarNavIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarNavIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarNavIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
