import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearView } from './year-view';

describe('YearView', () => {
  let component: YearView;
  let fixture: ComponentFixture<YearView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
