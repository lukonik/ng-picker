import { Provider } from "@angular/core";
import { DateAdapter } from "./date-adapter";
import {  DP_DATE_FORMATS, DpDateFormats } from "./date-formats";
import { NativeDateAdapter } from "./native-date-adapter";
import { DP_NATIVE_DATE_FORMATS } from "./native-date-formats";

export function provideNativeDateAdapter(
  formats: DpDateFormats = DP_NATIVE_DATE_FORMATS,
): Provider[] {
  return [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: DP_DATE_FORMATS, useValue: formats},
  ];
}
