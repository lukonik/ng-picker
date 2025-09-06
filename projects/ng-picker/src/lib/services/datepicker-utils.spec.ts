import { TestBed } from '@angular/core/testing';

import { DatepickerUtils } from './datepicker-utils';

describe('DatepickerUtils', () => {
  let service: DatepickerUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatepickerUtils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
