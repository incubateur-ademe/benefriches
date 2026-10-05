import { z } from "zod";

// Kept kebab-case so every value stays consistent. Two types are entity-scoped, and
// email_type alone says what their related_entity_id is: "first-project-reminder" carries
// the site id (sites.id, one row per user and site), "project-impacts-summary" the project
// id (reconversion_projects.id, one row per user and project).
export const lifecycleEmailTypeSchema = z.enum([
  "welcome",
  "first-site-reminder",
  "first-project-reminder",
  "project-impacts-summary",
]);
export type LifecycleEmailType = z.infer<typeof lifecycleEmailTypeSchema>;

// "failed" means "will be retried" by the sweeper; "abandoned" is terminal: the delivery
// used up LIFECYCLE_EMAIL_MAX_ATTEMPTS and is never retried again.
export const lifecycleEmailDeliveryStatusSchema = z.enum([
  "pending",
  "sent",
  "failed",
  "abandoned",
]);
export type LifecycleEmailDeliveryStatus = z.infer<typeof lifecycleEmailDeliveryStatusSchema>;

export type LifecycleEmailDelivery = {
  id: string;
  userId: string;
  emailType: LifecycleEmailType;
  relatedEntityId: string | null;
  status: LifecycleEmailDeliveryStatus;
  createdAt: Date;
  sentAt: Date | null;
  errorMessage: string | null;
  attempts: number;
  lastAttemptedAt: Date;
};

// 1 inline send + 4 hourly retries, so about 4 hours of coverage. A transient SMTP outage
// is covered; a nudge more than a few hours late loses its value, and a permanent
// rejection (bad address) won't fix itself. No back-off beyond the hourly cadence.
export const LIFECYCLE_EMAIL_MAX_ATTEMPTS = 5;
