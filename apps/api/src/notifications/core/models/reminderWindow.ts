import { subHours } from "date-fns";

// Reminders go to people who registered (or created a site, ticket 06) between 24 and 72
// hours before the run. 24 h guarantees everyone has had a full day, whatever time they
// signed up. The 48 h width makes the daily job self-healing: a missed run is caught up by
// the next one instead of silently skipping a cohort. The ledger's unique indexes stop
// the overlapping windows from sending twice.
export const REMINDER_MIN_AGE_HOURS = 24;
export const REMINDER_MAX_AGE_HOURS = 72;

export type ReminderWindow = {
  // Exclusive: exactly 72 h old is out.
  createdAfter: Date;
  // Inclusive: exactly 24 h old is in.
  createdAtOrBefore: Date;
};

export const computeReminderWindow = (now: Date): ReminderWindow => ({
  createdAfter: subHours(now, REMINDER_MAX_AGE_HOURS),
  createdAtOrBefore: subHours(now, REMINDER_MIN_AGE_HOURS),
});
