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

// Friche → the mockup's wording; every other nature → "site", the word the app itself uses
// for all of them.
// TODO(product): the non-friche wording ("un site" / "ce site") is ours, not the mockup's:
// to agree with product (plan P3). A per-nature wording ("une exploitation agricole", …) was
// considered and not kept.
const buildIntroParagraph = (site: LifecycleEmailSite): string => {
  const [indefinite, demonstrative] =
    site.nature === "FRICHE" ? ["une friche", "cette friche"] : ["un site", "ce site"];
  // TODO(product): "Hier" is inaccurate for most sites: the job runs daily with a 24–72 h
  // window on the site's creation, so most were created the day before yesterday. Proposal:
  // "Vous avez récemment renseigné une friche sur Bénéfriches." Optional: a comma after
  // "Hier" (plan P1, P2).
  return `Hier vous avez renseigné ${indefinite} sur Bénéfriches. Vous pouvez maintenant décrire un projet d’aménagement sur ${demonstrative}, pour ensuite découvrir ses impacts socio-économiques.`;
};

// Copy transcribed from the mockup (assets/03-first-project-reminder.png), with curly
// apostrophes throughout and non-breaking spaces before ":" and "?".
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
  // The name is user input: a newline has no place in a header.
  const subjectSiteName = input.site.name.replace(/\s+/g, " ").trim();

  // TODO(product): the body never names the site (as in the mockup), so a user with two
  // eligible sites gets two emails whose bodies only differ by their links. Proposal:
  // "Hier vous avez renseigné la friche « <nom> » sur Bénéfriches." (plan P8).
  const introParagraph = buildIntroParagraph(input.site);
  // TODO(product): "pré-remplies" — the recommended spelling is "préremplies" (plan P4).
  const prefilledDataParagraph = `Vous n’avez pas encore toutes les informations concernant ce projet${NBSP}? Pas de panique, Bénéfriches vous propose un maximum de données pré-remplies, basées sur des valeurs représentatives observées sur d’autres projets.`;
  // TODO(product): "accompagné" is masculine for a mixed audience; neutral alternative:
  // "Et si vous préférez un accompagnement pour prendre en main l’outil, …" (plan P6).
  const contactParagraph =
    "Et si vous préférez être accompagné dans la prise en main de l’outil, n’hésitez pas à me contacter directement.";

  return renderEmail({
    subject: `${subjectSiteName}${NBSP}: et si vous renseigniez votre projet d’aménagement${NBSP}?`,
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
