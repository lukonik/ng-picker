import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarNavButton } from './calendar-nav-button';

describe('CalendarNavButton', () => {
  let component: CalendarNavButton;
  let fixture: ComponentFixture<CalendarNavButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarNavButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarNavButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
