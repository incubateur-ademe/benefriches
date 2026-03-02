/** Date string in "YYYY-MM-DD" format, e.g. "2027-01-01" */
export type DateString = string & { readonly __brand: "DateString" };

/** Regular expression to match month/year display format "MM/YYYY" */
const MONTH_YEAR_DISPLAY_REGEX = /^(\d{2})\/(\d{4})$/;

export function monthYearDisplayToDateString(displayValue: string): DateString | undefined {
  const match = displayValue.match(MONTH_YEAR_DISPLAY_REGEX);
  if (!match) return undefined;

  const [, monthStr, yearStr] = match;
  const month = parseInt(monthStr!, 10);
  if (month < 1 || month > 12) return undefined;

  return `${yearStr}-${monthStr}-01` as DateString;
}

export function dateStringToMonthYearDisplay(dateString: string): string {
  const parts = dateString.split("-");
  if (parts.length < 2) return "";

  const [year, month] = parts;
  if (!year || !month || year.length !== 4 || month.length !== 2) return "";

  return `${month}/${year}`;
}
