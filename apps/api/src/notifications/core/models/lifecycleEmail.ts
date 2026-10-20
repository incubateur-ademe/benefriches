import type { LifecycleEmailDeliveryStatus, LifecycleEmailType } from "shared";

export {
  lifecycleEmailTypeSchema,
  type LifecycleEmailType,
  lifecycleEmailDeliveryStatusSchema,
  type LifecycleEmailDeliveryStatus,
  // 1 inline send + 4 hourly retries, so about 4 hours of coverage. A transient SMTP outage
  // is covered; a nudge more than a few hours late loses its value, and a permanent
  // rejection (bad address) won't fix itself. No back-off beyond the hourly cadence.
  LIFECYCLE_EMAIL_MAX_ATTEMPTS,
} from "shared";

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
