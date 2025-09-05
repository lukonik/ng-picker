/* eslint-disable @typescript-eslint/no-explicit-any */

import {InjectionToken} from '@angular/core';

export type DpDateFormats = {
  parse: {
    dateInput: any;
    timeInput?: any;
  };
  display: {
    dateInput: any;
    monthLabel?: any;
    monthYearLabel: any;
    dateA11yLabel: any;
    monthYearA11yLabel: any;
    timeInput?: any;
    timeOptionLabel?: any;
  };
};

export const DP_DATE_FORMATS = new InjectionToken<DpDateFormats>('dp-date-formats');
