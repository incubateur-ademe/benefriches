import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeReminderWindow, type ReminderWindow } from "./reminderWindow";

describe("computeReminderWindow", () => {
  it("computes a window from 72 hours to 24 hours before now", () => {
    const now = new Date("2026-01-15T08:00:00.000Z");

    const window = computeReminderWindow(now);

    assert.deepStrictEqual(window, {
      createdAfter: new Date("2026-01-12T08:00:00.000Z"),
      createdAtOrBefore: new Date("2026-01-14T08:00:00.000Z"),
    } satisfies ReminderWindow);
  });
});
