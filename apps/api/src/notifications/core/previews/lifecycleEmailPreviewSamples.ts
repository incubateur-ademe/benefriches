import { type LifecycleEmailType } from "src/notifications/core/models/lifecycleEmail";
import type { RenderedEmail } from "src/notifications/core/templates/emailLayout";
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

// Each later ticket that adds a lifecycle email type adds its case here. The switch below
// is exhaustive with no `default`, so a new value in `lifecycleEmailTypeSchema` fails
// typecheck here until its sample is added.
export function buildLifecycleEmailPreview(
  emailType: LifecycleEmailType,
  webappUrl: string,
  unsubscribeUrl: string,
): RenderedEmail {
  switch (emailType) {
    case "welcome":
      return buildWelcomeEmail({
        recipientEmail: PREVIEW_SAMPLE_USER.email,
        webappUrl,
        unsubscribeUrl,
      });
  }
}
