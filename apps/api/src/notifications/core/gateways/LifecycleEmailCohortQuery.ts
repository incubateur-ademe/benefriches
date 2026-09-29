import type { ReminderWindow } from "src/notifications/core/models/reminderWindow";

export type FirstSiteReminderRecipient = {
  userId: string;
  email: string;
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
  registeredAt: Date;
};

// Computes who is eligible for a scheduled lifecycle email. Read-only: the sender writes the
// ledger. Ticket 06 adds the first project reminder cohort here.
export interface LifecycleEmailCohortQuery {
  findFirstSiteReminderRecipients(window: ReminderWindow): Promise<FirstSiteReminderRecipient[]>;
}
