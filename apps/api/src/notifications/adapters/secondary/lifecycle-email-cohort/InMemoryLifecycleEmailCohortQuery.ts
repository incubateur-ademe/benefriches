import type {
  FirstSiteReminderRecipient,
  LifecycleEmailCohortQuery,
} from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { ReminderWindow } from "src/notifications/core/models/reminderWindow";

// A stub, on purpose: it applies no eligibility rule and returns the list it was given.
// Eligibility lives in SQL only (SqlLifecycleEmailCohortQuery, covered by its integration
// spec); reimplementing it here would test TypeScript against itself.
export class InMemoryLifecycleEmailCohortQuery implements LifecycleEmailCohortQuery {
  private firstSiteReminderRecipients: FirstSiteReminderRecipient[] = [];

  _setFirstSiteReminderRecipients(recipients: FirstSiteReminderRecipient[]): void {
    this.firstSiteReminderRecipients = recipients;
  }

  findFirstSiteReminderRecipients(_window: ReminderWindow): Promise<FirstSiteReminderRecipient[]> {
    return Promise.resolve(this.firstSiteReminderRecipients);
  }
}
