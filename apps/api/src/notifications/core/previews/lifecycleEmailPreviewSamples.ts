import { type LifecycleEmailType } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import type { RenderedEmail } from "src/notifications/core/templates/emailLayout";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildWelcomeEmail } from "src/notifications/core/templates/welcomeEmail";

// Invented persona used only for previews. Deliberately an RFC-2606 reserved domain so a
// preview can never be mistaken for, or delivered to, a real address.
export const PREVIEW_SAMPLE_USER = {
  // Matches no real user: the preview's unsubscribe link is genuinely signed for this id, so
  // a reviewer clicking it sees the real confirmation page while nothing is written.
  id: "00000000-0000-4000-8000-000000000000",
  firstName: "Camille",
  lastName: "Durand",
  email: "camille.durand@example.com",
} as const;

// Invented contact, used by previews only when LIFECYCLE_EMAILS_CONTACT_* is not configured.
// Deliberately not a real person, with an RFC-2606 reserved domain.
export const PREVIEW_SAMPLE_CONTACT = {
  firstName: "Dominique",
  lastName: "Exemple",
  role: "Chargé·e de déploiement",
  phone: "01 00 00 00 00",
  email: "dominique.exemple@example.com",
} as const satisfies LifecycleEmailContact;

// Each later ticket that adds a lifecycle email type adds its case here. The switch below
// is exhaustive with no `default`, so a new value in `lifecycleEmailTypeSchema` fails
// typecheck here until its sample is added.
export function buildLifecycleEmailPreview(
  emailType: LifecycleEmailType,
  webappUrl: string,
  unsubscribeUrl: string,
  contact: LifecycleEmailContact,
): RenderedEmail {
  switch (emailType) {
    case "welcome":
      return buildWelcomeEmail({
        recipientEmail: PREVIEW_SAMPLE_USER.email,
        webappUrl,
        unsubscribeUrl,
      });
    case "first-site-reminder":
      return buildFirstSiteReminderEmail({
        firstName: PREVIEW_SAMPLE_USER.firstName,
        lastName: PREVIEW_SAMPLE_USER.lastName,
        contact,
        webappUrl,
        unsubscribeUrl,
      });
  }
}
