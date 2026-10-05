import type { LifecycleEmailSite } from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { buildContactSections } from "src/notifications/core/templates/contactSections";
import {
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "src/notifications/core/templates/emailLayout";
import { buildGreeting, NBSP } from "src/notifications/core/templates/reminderGreeting";

export type BuildFirstProjectReminderEmailInput = {
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
  site: LifecycleEmailSite;
  contact: LifecycleEmailContact;
  webappUrl: string;
  unsubscribeUrl: string;
};

// Names the site, so that two reminders for two sites are told apart: "la friche « … »" for
// a friche, "le site « … »" for every other nature ("site" is the word the app itself uses
// for all of them). "Récemment", not "Hier": the job's 24–72 h window means most sites were
// created the day before yesterday.
// TODO(product): the non-friche wording ("le site" / "ce site") is ours, not the mockup's:
// to agree with product (plan P3). A per-nature wording ("une exploitation agricole", …) was
// considered and not kept.
const buildIntroParagraph = (nature: LifecycleEmailSite["nature"], siteName: string): string => {
  const [definite, demonstrative] =
    nature === "FRICHE" ? ["la friche", "cette friche"] : ["le site", "ce site"];
  return `Vous avez récemment renseigné ${definite} «${NBSP}${siteName}${NBSP}» sur Bénéfriches. Vous pouvez maintenant décrire un projet d’aménagement sur ${demonstrative}, pour ensuite découvrir ses impacts socio-économiques.`;
};

// Same friche / site split as the intro paragraph. A contraction ("de la" / "du"), so not a
// plain noun swap.
const buildPreheader = (site: LifecycleEmailSite): string => {
  const siteReference = site.nature === "FRICHE" ? "de la friche" : "du site";
  return `Comparez ses impacts à ceux du maintien ${siteReference} en l’état.`;
};

// Copy transcribed from the mockup (assets/03-first-project-reminder.png), with curly
// apostrophes throughout and non-breaking spaces before ":" and "?". The intro and the two
// wordings shared with the first site reminder (« préremplies », « un accompagnement… »)
// differ from the mockup, as decided with product.
//
// The mockup's friche-only offer ("Vous ne savez pas encore ce que vous pourriez faire sur
// cette friche ?", a paragraph and a secondary button) is deliberately not built (plan D8,
// user decision 2026-09-29): no page evaluates what an existing site could host yet. When
// one exists, it goes right after the primary button, gated on site.nature === "FRICHE".
export function buildFirstProjectReminderEmail(
  input: BuildFirstProjectReminderEmailInput,
): RenderedEmail {
  // Never a hardcoded domain: always built from the injected webapp URL.
  const ctaUrl = new URL("/creer-projet", input.webappUrl);
  ctaUrl.searchParams.set("siteId", input.site.id);
  const greeting = buildGreeting(input.firstName, input.lastName);
  // The name is user input, collapsed onto one line: a newline has no place in a header.
  // The intro shows the same name as the subject (escaped with the rest of the paragraph).
  const siteName = input.site.name.replace(/\s+/g, " ").trim();

  const introParagraph = buildIntroParagraph(input.site.nature, siteName);
  const prefilledDataParagraph = `Vous n’avez pas encore toutes les informations concernant ce projet${NBSP}? Pas de panique, Bénéfriches vous propose un maximum de données préremplies, basées sur des valeurs représentatives observées sur d’autres projets.`;
  const contactParagraph =
    "Et si vous préférez un accompagnement pour prendre en main l’outil, n’hésitez pas à me contacter directement.";

  return renderEmail({
    subject: `${siteName}${NBSP}: et si vous renseigniez votre projet d’aménagement${NBSP}?`,
    preheader: buildPreheader(input.site),
    unsubscribeUrl: input.unsubscribeUrl,
    sections: [
      { type: "paragraph", html: escapeHtml(greeting), text: greeting },
      { type: "paragraph", html: escapeHtml(introParagraph), text: introParagraph },
      {
        type: "paragraph",
        html: escapeHtml(prefilledDataParagraph),
        text: prefilledDataParagraph,
      },
      { type: "button", label: "Renseigner mon projet", url: ctaUrl.toString() },
      { type: "paragraph", html: escapeHtml(contactParagraph), text: contactParagraph },
      ...buildContactSections(input.contact),
    ],
  });
}
