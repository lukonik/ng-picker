/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { NativeDateAdapter } from './native-date-adapter';
import { DP_DATE_LOCALE } from './date-adapter';

describe('NativeDateAdapter', () => {
  let adapter: NativeDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeDateAdapter]
    });
    adapter = TestBed.inject(NativeDateAdapter);
  });

  describe('constructor', () => {
    it('should initialize with default locale', () => {
      expect(adapter).toBeTruthy();
      expect((adapter as any).locale).toBe('en-US');
    });

    it('should initialize with provided locale', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          NativeDateAdapter,
          { provide: DP_DATE_LOCALE, useValue: 'fr-FR' }
        ]
      });

      const frenchAdapter = TestBed.inject(NativeDateAdapter);
      expect((frenchAdapter as any).locale).toBe('fr-FR');
    });

    it('should initialize with LOCALE_ID when DP_DATE_LOCALE is not provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          NativeDateAdapter,
          { provide: LOCALE_ID, useValue: 'de-DE' }
        ]
      });

      const germanAdapter = TestBed.inject(NativeDateAdapter);
      expect((germanAdapter as any).locale).toBe('de-DE');
    });
  });

  describe('getYear', () => {
    it('should return the year', () => {
      const date = new Date(2023, 5, 15);
      expect(adapter.getYear(date)).toBe(2023);
    });
  });

  describe('getMonth', () => {
    it('should return the month (0-indexed)', () => {
      const date = new Date(2023, 5, 15); // June
      expect(adapter.getMonth(date)).toBe(5);
    });
  });

  describe('getDate', () => {
    it('should return the date of month', () => {
      const date = new Date(2023, 5, 15);
      expect(adapter.getDate(date)).toBe(15);
    });
  });

  describe('getDayOfWeek', () => {
    it('should return the day of week (0 = Sunday)', () => {
      const sunday = new Date(2023, 5, 18); // Sunday
      const monday = new Date(2023, 5, 19); // Monday

      expect(adapter.getDayOfWeek(sunday)).toBe(0);
      expect(adapter.getDayOfWeek(monday)).toBe(1);
    });
  });

  describe('getMonthNames', () => {
    it('should return long month names', () => {
      const months = adapter.getMonthNames('long');
      expect(months).toHaveLength(12);
      expect(months[0]).toBe('January');
      expect(months[11]).toBe('December');
    });

    it('should return short month names', () => {
      const months = adapter.getMonthNames('short');
      expect(months).toHaveLength(12);
      expect(months[0]).toBe('Jan');
      expect(months[11]).toBe('Dec');
    });

    it('should return narrow month names', () => {
      const months = adapter.getMonthNames('narrow');
      expect(months).toHaveLength(12);
      expect(months[0]).toBe('J');
      expect(months[11]).toBe('D');
    });
  });

  describe('getDateNames', () => {
    it('should return date names from 1 to 31', () => {
      const dates = adapter.getDateNames();
      expect(dates).toHaveLength(31);
      expect(dates[0]).toBe('1');
      expect(dates[30]).toBe('31');
    });
  });

  describe('getDayOfWeekNames', () => {
    it('should return long day names', () => {
      const days = adapter.getDayOfWeekNames('long');
      expect(days).toHaveLength(7);
      expect(days[0]).toBe('Sunday');
      expect(days[1]).toBe('Monday');
      expect(days[6]).toBe('Saturday');
    });

    it('should return short day names', () => {
      const days = adapter.getDayOfWeekNames('short');
      expect(days).toHaveLength(7);
      expect(days[0]).toBe('Sun');
      expect(days[1]).toBe('Mon');
      expect(days[6]).toBe('Sat');
    });

    it('should return narrow day names', () => {
      const days = adapter.getDayOfWeekNames('narrow');
      expect(days).toHaveLength(7);
      expect(days[0]).toBe('S');
      expect(days[1]).toBe('M');
      expect(days[6]).toBe('S');
    });
  });

  describe('getYearName', () => {
    it('should return the year as string', () => {
      const date = new Date(2023, 5, 15);
      expect(adapter.getYearName(date)).toBe('2023');
    });
  });

  describe('getFirstDayOfWeek', () => {
    it('should return 0 for Sunday as default', () => {
      expect(adapter.getFirstDayOfWeek()).toBe(0);
    });
  });

  describe('getNumDaysInMonth', () => {
    it('should return correct number of days for different months', () => {
      const january = new Date(2023, 0, 15);
      const february = new Date(2023, 1, 15);
      const leapFebruary = new Date(2024, 1, 15);
      const april = new Date(2023, 3, 15);

      expect(adapter.getNumDaysInMonth(january)).toBe(31);
      expect(adapter.getNumDaysInMonth(february)).toBe(28);
      expect(adapter.getNumDaysInMonth(leapFebruary)).toBe(29);
      expect(adapter.getNumDaysInMonth(april)).toBe(30);
    });
  });

  describe('clone', () => {
    it('should create a copy of the date', () => {
      const original = new Date(2023, 5, 15, 10, 30, 45);
      const cloned = adapter.clone(original);

      expect(cloned).not.toBe(original);
      expect(cloned.getTime()).toBe(original.getTime());
    });
  });

  describe('createDate', () => {
    it('should create a valid date', () => {
      const date = adapter.createDate(2023, 5, 15);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(15);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it('should throw error for invalid month', () => {
      expect(() => adapter.createDate(2023, -1, 15)).toThrowError('Invalid month index "-1". Month index has to be between 0 and 11.');
      expect(() => adapter.createDate(2023, 12, 15)).toThrowError('Invalid month index "12". Month index has to be between 0 and 11.');
    });

    it('should throw error for invalid date', () => {
      expect(() => adapter.createDate(2023, 5, 0)).toThrowError('Invalid date "0". Date has to be greater than 0.');
      expect(() => adapter.createDate(2023, 1, 30)).toThrowError('Invalid date "30" for month with index "1".');
    });
  });

  describe('today', () => {
    it('should return current date', () => {
      const today = adapter.today();
      const now = new Date();

      expect(today.getFullYear()).toBe(now.getFullYear());
      expect(today.getMonth()).toBe(now.getMonth());
      expect(today.getDate()).toBe(now.getDate());
    });
  });

  describe('parse', () => {
    it('should parse number as timestamp', () => {
      const timestamp = new Date(2023, 5, 15).getTime();
      const parsed = adapter.parse(timestamp);

      expect(parsed?.getFullYear()).toBe(2023);
      expect(parsed?.getMonth()).toBe(5);
      expect(parsed?.getDate()).toBe(15);
    });

    it('should parse date string', () => {
      const parsed = adapter.parse('2023-06-15');

      expect(parsed?.getFullYear()).toBe(2023);
      expect(parsed?.getMonth()).toBe(5); // Month is 0-indexed
      expect(parsed?.getDate()).toBe(15);
    });

    it('should return null for falsy values', () => {
      expect(adapter.parse(null)).toBeNull();
      expect(adapter.parse('')).toBeNull();
      expect(adapter.parse(undefined)).toBeNull();
    });

    it('should return invalid date for invalid date string', () => {
      const parsed = adapter.parse('invalid-date');
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed && adapter.isValid(parsed)).toBe(false);
    });
  });

  describe('format', () => {
    it('should format date according to display format', () => {
      const date = new Date(2023, 5, 15);
      const formatted = adapter.format(date, { year: 'numeric', month: 'long', day: 'numeric' });

      expect(formatted).toBe('June 15, 2023');
    });

    it('should throw error for invalid date', () => {
      const invalidDate = new Date(NaN);
      expect(() => adapter.format(invalidDate, {})).toThrowError('NativeDateAdapter: Cannot format invalid date.');
    });
  });

  describe('addCalendarYears', () => {
    it('should add years to date', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.addCalendarYears(date, 2);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    it('should subtract years from date', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.addCalendarYears(date, -2);

      expect(result.getFullYear()).toBe(2021);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });
  });

  describe('addCalendarMonths', () => {
    it('should add months to date', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.addCalendarMonths(date, 3);

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(8);
      expect(result.getDate()).toBe(15);
    });

    it('should handle year overflow', () => {
      const date = new Date(2023, 11, 15); // December
      const result = adapter.addCalendarMonths(date, 2);

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(15);
    });

    it('should handle month overflow by going to last day of target month', () => {
      const date = new Date(2023, 0, 31); // January 31
      const result = adapter.addCalendarMonths(date, 1);

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(28); // Last day of February 2023
    });
  });

  describe('addCalendarDays', () => {
    it('should add days to date', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.addCalendarDays(date, 10);

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(25);
    });

    it('should handle month overflow', () => {
      const date = new Date(2023, 5, 28);
      const result = adapter.addCalendarDays(date, 5);

      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(3);
    });
  });

  describe('toIso8601', () => {
    it('should convert date to ISO string', () => {
      const date = new Date(2023, 5, 15);
      const iso = adapter.toIso8601(date);

      // toIso8601 uses UTC methods, so we need to check the actual UTC date
      const expectedIso = [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0')
      ].join('-');
      
      expect(iso).toBe(expectedIso);
    });

    it('should pad single digits', () => {
      const date = new Date(2023, 0, 5); // January 5
      const iso = adapter.toIso8601(date);

      // toIso8601 uses UTC methods, so we need to check the actual UTC date
      const expectedIso = [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0')
      ].join('-');
      
      expect(iso).toBe(expectedIso);
    });
  });

  describe('deserialize', () => {
    it('should return valid dates as-is', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.deserialize(date);

      expect(result).toBe(date);
    });

    it('should return null for null input', () => {
      expect(adapter.deserialize(null)).toBeNull();
      expect(adapter.deserialize('')).toBeNull();
    });

    it('should deserialize ISO 8601 strings', () => {
      const result = adapter.deserialize('2023-06-15T10:30:00Z');

      expect(result).toBeInstanceOf(Date);
      expect(result && result.getFullYear()).toBe(2023);
      expect(result && result.getMonth()).toBe(5);
      expect(result && result.getDate()).toBe(15);
    });

    it('should return invalid date for malformed strings', () => {
      const result = adapter.deserialize('not-a-date');

      expect(result).toBeInstanceOf(Date);
      expect(result && adapter.isValid(result)).toBe(false);
    });
  });

  describe('isDateInstance', () => {
    it('should return true for Date objects', () => {
      const date = new Date();
      expect(adapter.isDateInstance(date)).toBe(true);
    });

    it('should return false for non-Date objects', () => {
      expect(adapter.isDateInstance('2023-06-15')).toBe(false);
      expect(adapter.isDateInstance(123456789)).toBe(false);
      expect(adapter.isDateInstance({})).toBe(false);
      expect(adapter.isDateInstance(null)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for valid dates', () => {
      const date = new Date(2023, 5, 15);
      expect(adapter.isValid(date)).toBe(true);
    });

    it('should return false for invalid dates', () => {
      const invalidDate = new Date(NaN);
      expect(adapter.isValid(invalidDate)).toBe(false);
    });
  });

  describe('invalid', () => {
    it('should return invalid date', () => {
      const invalid = adapter.invalid();
      expect(adapter.isValid(invalid)).toBe(false);
    });
  });

  describe('setTime', () => {
    it('should set time components', () => {
      const date = new Date(2023, 5, 15);
      const result = adapter.setTime(date, 14, 30, 45);

      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
      expect(result.getMilliseconds()).toBe(0);

      // Should not modify original date
      expect(date.getHours()).not.toBe(14);
    });

    it('should throw error for invalid hours', () => {
      const date = new Date(2023, 5, 15);
      expect(() => adapter.setTime(date, -1, 0, 0)).toThrowError('Invalid hours "-1". Hours value must be between 0 and 23.');
      expect(() => adapter.setTime(date, 24, 0, 0)).toThrowError('Invalid hours "24". Hours value must be between 0 and 23.');
    });

    it('should throw error for invalid minutes', () => {
      const date = new Date(2023, 5, 15);
      expect(() => adapter.setTime(date, 12, -1, 0)).toThrowError('Invalid minutes "-1". Minutes value must be between 0 and 59.');
      expect(() => adapter.setTime(date, 12, 60, 0)).toThrowError('Invalid minutes "60". Minutes value must be between 0 and 59.');
    });

    it('should throw error for invalid seconds', () => {
      const date = new Date(2023, 5, 15);
      expect(() => adapter.setTime(date, 12, 30, -1)).toThrowError('Invalid seconds "-1". Seconds value must be between 0 and 59.');
      expect(() => adapter.setTime(date, 12, 30, 60)).toThrowError('Invalid seconds "60". Seconds value must be between 0 and 59.');
    });
  });

  describe('getHours', () => {
    it('should return hours component', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      expect(adapter.getHours(date)).toBe(14);
    });
  });

  describe('getMinutes', () => {
    it('should return minutes component', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      expect(adapter.getMinutes(date)).toBe(30);
    });
  });

  describe('getSeconds', () => {
    it('should return seconds component', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      expect(adapter.getSeconds(date)).toBe(45);
    });
  });

  describe('parseTime', () => {
    it('should parse 24-hour time with colon', () => {
      const result = adapter.parseTime('14:30');
      expect(result && adapter.getHours(result)).toBe(14);
      expect(result && adapter.getMinutes(result)).toBe(30);
      expect(result && adapter.getSeconds(result)).toBe(0);
    });

    it('should parse 24-hour time with seconds', () => {
      const result = adapter.parseTime('14:30:45');
      expect(result && adapter.getHours(result)).toBe(14);
      expect(result && adapter.getMinutes(result)).toBe(30);
      expect(result && adapter.getSeconds(result)).toBe(45);
    });

    it('should parse 12-hour time with AM', () => {
      const result = adapter.parseTime('2:30 AM');
      expect(result && adapter.getHours(result)).toBe(2);
      expect(result && adapter.getMinutes(result)).toBe(30);
    });

    it('should parse 12-hour time with PM', () => {
      const result = adapter.parseTime('2:30 PM');
      expect(result && adapter.getHours(result)).toBe(14);
      expect(result && adapter.getMinutes(result)).toBe(30);
    });

    it('should parse 12:XX AM as 00:XX', () => {
      const result = adapter.parseTime('12:30 AM');
      expect(result && adapter.getHours(result)).toBe(0);
      expect(result && adapter.getMinutes(result)).toBe(30);
    });

    it('should parse 12:XX PM as 12:XX', () => {
      const result = adapter.parseTime('12:30 PM');
      expect(result && adapter.getHours(result)).toBe(12);
      expect(result && adapter.getMinutes(result)).toBe(30);
    });

    it('should parse time with dots', () => {
      const result = adapter.parseTime('14.30');
      expect(result && adapter.getHours(result)).toBe(14);
      expect(result && adapter.getMinutes(result)).toBe(30);
    });

    it('should handle extra characters', () => {
      const result = adapter.parseTime('00:05 ч.');
      expect(result && adapter.getHours(result)).toBe(0);
      expect(result && adapter.getMinutes(result)).toBe(5);
    });

    it('should return null for empty string', () => {
      expect(adapter.parseTime('')).toBeNull();
      expect(adapter.parseTime('   ')).toBeNull();
    });

    it('should return Date object for Date input', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      const result = adapter.parseTime(date);

      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBe(date); // Should be a clone
      expect(result && result.getTime()).toBe(date.getTime());
    });

    it('should return null for non-string, non-Date input', () => {
      expect(adapter.parseTime(123)).toBeNull();
      expect(adapter.parseTime({})).toBeNull();
      expect(adapter.parseTime(null)).toBeNull();
    });

    it('should return invalid date for invalid time string', () => {
      const result = adapter.parseTime('invalid-time');
      expect(result && adapter.isValid(result)).toBe(false);
    });

    it('should reject invalid time ranges', () => {
      const result = adapter.parseTime('25:70');
      expect(result && adapter.isValid(result)).toBe(false);
    });
  });

  describe('addSeconds', () => {
    it('should add seconds to date', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      const result = adapter.addSeconds(date, 30);

      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(31);
      expect(result.getSeconds()).toBe(15);
    });

    it('should subtract seconds from date', () => {
      const date = new Date(2023, 5, 15, 14, 30, 45);
      const result = adapter.addSeconds(date, -45);

      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });

    it('should handle minute/hour overflow', () => {
      const date = new Date(2023, 5, 15, 23, 59, 30);
      const result = adapter.addSeconds(date, 45);

      expect(result.getDate()).toBe(16);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(15);
    });
  });

  describe('private methods', () => {
    describe('_createDateWithOverflow', () => {
      it('should handle month overflow', () => {
        const date = (adapter as any)._createDateWithOverflow(2023, 13, 1);
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(1); // February
        expect(date.getDate()).toBe(1);
      });

      it('should handle day overflow', () => {
        const date = (adapter as any)._createDateWithOverflow(2023, 1, 32);
        expect(date.getFullYear()).toBe(2023);
        expect(date.getMonth()).toBe(2); // March
        expect(date.getDate()).toBe(4); // 32 - 28 = 4
      });
    });

    describe('_2digit', () => {
      it('should pad single digit numbers', () => {
        expect((adapter as any)._2digit(5)).toBe('05');
        expect((adapter as any)._2digit(15)).toBe('15');
      });
    });

    describe('_format', () => {
      it('should format date using DateTimeFormat', () => {
        const date = new Date(2023, 5, 15, 14, 30, 45);
        const dtf = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'utc'
        });

        const result = (adapter as any)._format(dtf, date);
        expect(result).toBe('June 15, 2023');
      });
    });

    describe('_parseTimeString', () => {
      it('should parse valid time string', () => {
        const result = (adapter as any)._parseTimeString('14:30:45');
        expect(adapter.getHours(result)).toBe(14);
        expect(adapter.getMinutes(result)).toBe(30);
        expect(adapter.getSeconds(result)).toBe(45);
      });

      it('should return null for invalid time string', () => {
        const result = (adapter as any)._parseTimeString('invalid');
        expect(result).toBeNull();
      });
    });
  });

  describe('integration with base DateAdapter', () => {
    it('should properly extend DateAdapter methods', () => {
      const date1 = new Date(2023, 5, 15);
      const date2 = new Date(2023, 5, 20);

      expect(adapter.compareDate(date1, date2)).toBeLessThan(0);
      expect(adapter.compareDate(date2, date1)).toBeGreaterThan(0);
      expect(adapter.compareDate(date1, date1)).toBe(0);
    });

    it('should handle locale changes', () => {
      const initialMonths = adapter.getMonthNames('long');

      adapter.setLocale('fr-FR');
      const frenchMonths = adapter.getMonthNames('long');

      expect(frenchMonths[0]).not.toBe(initialMonths[0]);
      expect(frenchMonths[0]).toBe('janvier');
    });
  });
});
