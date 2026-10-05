import type { LifecycleEmailProject } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { LifecycleEmailSite } from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import { type LifecycleEmailType } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import type { RenderedEmail } from "src/notifications/core/templates/emailLayout";
import { buildFirstProjectReminderEmail } from "src/notifications/core/templates/firstProjectReminderEmail";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import {
  buildProjectImpactsSummaryEmail,
  type ProjectImpactsSummaryContent,
} from "src/notifications/core/templates/projectImpactsSummaryEmail";
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

// Invented sites for the first project reminder previews: one friche and one non-friche,
// since the first paragraph depends on the nature. Their ids match no real site, so the
// "Renseigner mon projet" link of a preview leads to an error page: nothing real is touched.
export const PREVIEW_SAMPLE_FRICHE = {
  id: "00000000-0000-4000-8000-000000000001",
  // The mockup's site.
  name: "Ancienne carrière d’argile de Blajan",
  nature: "FRICHE",
} as const satisfies LifecycleEmailSite;

export const PREVIEW_SAMPLE_NON_FRICHE_SITE = {
  id: "00000000-0000-4000-8000-000000000002",
  name: "Exploitation agricole des Quatre Chemins",
  nature: "AGRICULTURAL_OPERATION",
} as const satisfies LifecycleEmailSite;

// The mockup's project (assets/04): its id matches no real project, so a preview's card links
// lead to an error page, like the other samples.
export const PREVIEW_SAMPLE_PROJECT = {
  id: "00000000-0000-4000-8000-000000000003",
  name: "Habitation, école et commerce",
  siteName: "Ancienne carrière d’argile de Blajan",
  createdAt: new Date("2026-06-15T10:00:00.000Z"),
} as const satisfies LifecycleEmailProject;

// Favourable: every card as in the mockup (values from it), with the app's wording.
export const PREVIEW_SAMPLE_FAVOURABLE_IMPACTS_SUMMARY = {
  project: PREVIEW_SAMPLE_PROJECT,
  evaluationPeriodInYears: 50,
  zanCompliance: {
    name: "zanCompliance",
    isSuccess: true,
    value: { isAgriculturalFriche: false, artificializedSurfaceArea: 0 },
  },
  breakEvenHorizon: { status: "compensated", breakEvenYear: "2058", yearsToBreakEven: 26 },
  mainImpactIndicator: {
    name: "avoidedFricheCostsForLocalAuthority",
    isSuccess: true,
    value: {
      total: 1_087_355,
      details: [
        { impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner", amount: 1_087_355 },
      ],
    },
  },
} satisfies ProjectImpactsSummaryContent;

// Unfavourable: ZAN (sols imperméabilisés), cost not compensated, losses for the collectivité.
export const PREVIEW_SAMPLE_UNFAVOURABLE_IMPACTS_SUMMARY = {
  project: PREVIEW_SAMPLE_PROJECT,
  evaluationPeriodInYears: 50,
  zanCompliance: {
    name: "zanCompliance",
    isSuccess: false,
    value: {
      isAgriculturalFriche: false,
      permeableSurfaceAreaDifference: -1200,
      artificializedSurfaceArea: 1200,
    },
  },
  breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
  mainImpactIndicator: { name: "taxesIncomesImpact", isSuccess: false, value: -45_000 },
} satisfies ProjectImpactsSummaryContent;

// Every sample of the type, in order: most types have one, a type whose content varies
// (first project reminder: friche or not) has one per variant. Each later ticket that adds a
// lifecycle email type adds its case here. The switch below is exhaustive with no
// `default`, so a new value in `lifecycleEmailTypeSchema` fails typecheck here until its
// sample is added.
export function buildLifecycleEmailPreviews(
  emailType: LifecycleEmailType,
  webappUrl: string,
  unsubscribeUrl: string,
  contact: LifecycleEmailContact,
): RenderedEmail[] {
  switch (emailType) {
    case "welcome":
      return [
        buildWelcomeEmail({
          recipientEmail: PREVIEW_SAMPLE_USER.email,
          webappUrl,
          unsubscribeUrl,
        }),
      ];
    case "first-site-reminder":
      return [
        buildFirstSiteReminderEmail({
          firstName: PREVIEW_SAMPLE_USER.firstName,
          lastName: PREVIEW_SAMPLE_USER.lastName,
          contact,
          webappUrl,
          unsubscribeUrl,
        }),
      ];
    case "first-project-reminder":
      return [PREVIEW_SAMPLE_FRICHE, PREVIEW_SAMPLE_NON_FRICHE_SITE].map((site) =>
        buildFirstProjectReminderEmail({
          firstName: PREVIEW_SAMPLE_USER.firstName,
          lastName: PREVIEW_SAMPLE_USER.lastName,
          site,
          contact,
          webappUrl,
          unsubscribeUrl,
        }),
      );
    // No contact signature in this email. A real project's summary is the preview use case's
    // async path (--project-id), not a sample.
    case "project-impacts-summary":
      return [
        PREVIEW_SAMPLE_FAVOURABLE_IMPACTS_SUMMARY,
        PREVIEW_SAMPLE_UNFAVOURABLE_IMPACTS_SUMMARY,
      ].map((content) =>
        buildProjectImpactsSummaryEmail({ ...content, webappUrl, unsubscribeUrl }),
      );
  }
}
