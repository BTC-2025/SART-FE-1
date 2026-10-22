/**
 * Live Date & Time Helpers
 * Always computes current dates dynamically instead of hardcoded timestamps.
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Returns live current Date */
export function getNow(): Date {
  return new Date();
}

/** Formats a date object to "Wed, 22 Oct" */
export function formatDayMonthShort(d: Date = new Date()): string {
  const weekday = WEEKDAYS_SHORT[d.getDay()];
  const day = d.getDate();
  const month = MONTH_SHORT[d.getMonth()];
  return `${weekday}, ${day} ${month}`;
}

/** Formats a date object to "22 Oct, 2026" or with padded day "22 Oct, 2026" */
export function formatDayMonthYear(d: Date = new Date(), padDay = false): string {
  const day = padDay ? String(d.getDate()).padStart(2, '0') : d.getDate();
  const month = MONTH_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

/** Formats a date object to "Wed, 22 Oct, 2026" */
export function formatFullDate(d: Date = new Date()): string {
  const weekday = WEEKDAYS_SHORT[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTH_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month}, ${year}`;
}

/** Formats a date to ISO string for input[type="date"], e.g. "2026-10-22" */
export function formatISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns date offset by +N days from now */
export function addDays(days: number, baseDate: Date = new Date()): Date {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

/** Generates rolling rolling date strip starting from today for N days */
export function getRollingDates(count: number = 14, baseDate: Date = new Date()) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const d = addDays(i, baseDate);
    list.push({
      dateObj: d,
      num: String(d.getDate()).padStart(2, '0'),
      rawNum: d.getDate(),
      day: WEEKDAYS_SHORT[d.getDay()],
      month: MONTH_SHORT[d.getMonth()],
      monthFull: MONTH_NAMES[d.getMonth()],
      year: d.getFullYear(),
      fullString: `${String(d.getDate()).padStart(2, '0')} ${MONTH_SHORT[d.getMonth()]}, ${d.getFullYear()}`,
      shortLabel: `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`
    });
  }
  return list;
}
