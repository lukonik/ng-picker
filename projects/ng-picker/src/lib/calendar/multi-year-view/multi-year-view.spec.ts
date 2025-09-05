import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiYearView } from './multi-year-view';

describe('MultiYearView', () => {
  let component: MultiYearView;
  let fixture: ComponentFixture<MultiYearView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiYearView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiYearView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
