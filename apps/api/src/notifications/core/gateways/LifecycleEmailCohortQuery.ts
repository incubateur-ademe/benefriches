import type { SiteNature } from "shared";

import type { ReminderWindow } from "src/notifications/core/models/reminderWindow";

export type FirstSiteReminderRecipient = {
  userId: string;
  email: string;
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
  registeredAt: Date;
};

// One row per eligible site, never grouped by user: a user with two eligible sites gets two
// reminders.
export type FirstProjectReminderSite = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  siteCreatedAt: Date;
  userId: string;
  email: string;
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
};

// Computes who is eligible for a scheduled lifecycle email. Read-only: the sender writes the
// ledger.
export interface LifecycleEmailCohortQuery {
  findFirstSiteReminderRecipients(window: ReminderWindow): Promise<FirstSiteReminderRecipient[]>;
  findFirstProjectReminderSites(window: ReminderWindow): Promise<FirstProjectReminderSite[]>;
}
