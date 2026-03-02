import { describe, expect, it } from "vitest";

import { monthYearDisplayToDateString, dateStringToMonthYearDisplay } from "./monthYearConversion";

describe("monthYearDisplayToDateString", () => {
  it("converts '01/2027' to '2027-01-01'", () => {
    expect(monthYearDisplayToDateString("01/2027")).toBe("2027-01-01");
  });

  it("converts '12/2025' to '2025-12-01'", () => {
    expect(monthYearDisplayToDateString("12/2025")).toBe("2025-12-01");
  });

  it("returns undefined for incomplete input", () => {
    expect(monthYearDisplayToDateString("01/202")).toBeUndefined();
    expect(monthYearDisplayToDateString("0")).toBeUndefined();
    expect(monthYearDisplayToDateString("")).toBeUndefined();
  });

  it("returns undefined for invalid month", () => {
    expect(monthYearDisplayToDateString("00/2027")).toBeUndefined();
    expect(monthYearDisplayToDateString("13/2027")).toBeUndefined();
  });

  it("returns undefined for non-numeric input", () => {
    expect(monthYearDisplayToDateString("ab/cdef")).toBeUndefined();
  });
});

describe("dateStringToMonthYearDisplay", () => {
  it("converts '2027-01-01' to '01/2027'", () => {
    expect(dateStringToMonthYearDisplay("2027-01-01")).toBe("01/2027");
  });

  it("converts '2025-12-15' to '12/2025'", () => {
    expect(dateStringToMonthYearDisplay("2025-12-15")).toBe("12/2025");
  });

  it("returns empty string for invalid input", () => {
    expect(dateStringToMonthYearDisplay("")).toBe("");
    expect(dateStringToMonthYearDisplay("invalid")).toBe("");
    expect(dateStringToMonthYearDisplay("2027")).toBe("");
  });
});
