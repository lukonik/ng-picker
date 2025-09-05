import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPicker } from './ng-picker';

describe('NgPicker', () => {
  let component: NgPicker;
  let fixture: ComponentFixture<NgPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
