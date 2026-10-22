import type { AdminUserTimelineEvent } from "../../core/admin.types";

export type TimelineEventCategory = "activity" | "email";

export type TimelineEventBadge = {
  label: string;
  severity?: "success" | "warning" | "error";
};

export const getTimelineEventCategory = (event: AdminUserTimelineEvent): TimelineEventCategory => {
  switch (event.type) {
    case "lifecycle_email_sent":
    case "lifecycle_email_failed":
    case "lifecycle_emails_unsubscribed":
      return "email";
    default:
      return "activity";
  }
};

export const getTimelineEventBadge = (event: AdminUserTimelineEvent): TimelineEventBadge | null => {
  switch (event.type) {
    case "lifecycle_email_sent":
      return { label: "Envoyé", severity: "success" };
    case "lifecycle_email_failed":
      return event.deliveryStatus === "abandoned"
        ? { label: "Échec · abandonné", severity: "error" }
        : { label: "Échec · nouvelle tentative prévue", severity: "warning" };
    case "lifecycle_emails_unsubscribed":
      return { label: "Désinscription" };
    default:
      return null;
  }
};

export const getTimelineEventDetail = (
  event: AdminUserTimelineEvent,
  lifecycleEmailMaxAttempts: number,
): string | null => {
  switch (event.type) {
    case "lifecycle_email_failed": {
      const attempts = `Tentative ${event.deliveryAttempts} sur ${lifecycleEmailMaxAttempts}`;
      return event.deliveryErrorMessage ? `${attempts} · ${event.deliveryErrorMessage}` : attempts;
    }
    case "lifecycle_emails_unsubscribed":
      return "Plus aucun email de rappel ne sera envoyé à cet utilisateur.";
    default:
      return null;
  }
};

export const isTimelineEventInError = (event: AdminUserTimelineEvent): boolean =>
  event.deliveryStatus === "failed" || event.deliveryStatus === "abandoned";
