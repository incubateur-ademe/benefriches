import { z } from "zod";

// Later tickets extend this enum with "first-project-reminder" and "project-impacts-summary".
// Kept kebab-case so every value stays consistent.
export const lifecycleEmailTypeSchema = z.enum(["welcome", "first-site-reminder"]);
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
