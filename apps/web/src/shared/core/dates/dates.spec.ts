import { describe, expect, it } from "vitest";

import { formatDateFr } from ".";

describe("formatDateFr", () => {
  it("formats a date as dd/mm/yyyy, whatever the runtime locale", () => {
    expect(formatDateFr(new Date(2030, 5, 1))).toEqual("01/06/2030");
  });
});
