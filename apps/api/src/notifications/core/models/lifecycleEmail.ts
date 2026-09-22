import { z } from "zod";

// Later tickets extend this enum with "first-site-reminder", "first-project-reminder",
// "project-impacts-summary". Kept kebab-case now so future values stay consistent.
export const lifecycleEmailTypeSchema = z.enum(["welcome"]);
export type LifecycleEmailType = z.infer<typeof lifecycleEmailTypeSchema>;

export const lifecycleEmailDeliveryStatusSchema = z.enum(["pending", "sent", "failed"]);
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
};
