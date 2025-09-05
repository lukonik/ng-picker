import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthViewCell } from './month-view-cell';

describe('MonthViewCell', () => {
  let component: MonthViewCell;
  let fixture: ComponentFixture<MonthViewCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthViewCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthViewCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
