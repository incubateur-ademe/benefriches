import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { buildContactSections } from "src/notifications/core/templates/contactSections";
import {
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "src/notifications/core/templates/emailLayout";
import { buildGreeting, NBSP } from "src/notifications/core/templates/reminderGreeting";

export type BuildFirstSiteReminderEmailInput = {
  // Nullable: legacy users rows have no first or last name.
  firstName: string | null;
  lastName: string | null;
  contact: LifecycleEmailContact;
  webappUrl: string;
  unsubscribeUrl: string;
};

// Copy transcribed from the mockup (assets/02-first-site-reminder.png), with curly
// apostrophes throughout and non-breaking spaces before "!", "?" and ":".
export function buildFirstSiteReminderEmail(
  input: BuildFirstSiteReminderEmailInput,
): RenderedEmail {
  // Never a hardcoded domain: always built from the injected webapp URL.
  const ctaUrl = new URL("/creer-site-foncier", input.webappUrl).toString();
  const greeting = buildGreeting(input.firstName, input.lastName);

  // TODO(product): "Hier" is inaccurate for most of the cohort: the job runs daily with a
  // 24–72 h window, so most recipients registered the day before yesterday. Proposal:
  // "Vous avez récemment créé votre compte sur Bénéfriches." Optional: a comma after "Hier".
  const introParagraph =
    "Hier vous avez créé votre compte sur Bénéfriches. Vous pouvez maintenant renseigner un site (friche ou autre), pour ensuite y décrire votre projet d’aménagement avant de découvrir les impacts socio-économiques de ce projet sur votre site.";
  // TODO(product): "pré-remplies" — the recommended spelling is "préremplies".
  const prefilledDataParagraph = `Vous n’avez pas encore toutes les informations concernant ce site${NBSP}? Pas de panique, Bénéfriches vous propose un maximum de données pré-remplies, basées sur des valeurs représentatives observées sur d’autres sites.`;
  // TODO(product): "accompagné" is masculine for a mixed audience; neutral alternative:
  // "Et si vous préférez un accompagnement pour prendre en main l’outil, …".
  const contactParagraph =
    "Et si vous préférez être accompagné dans la prise en main de l’outil, n’hésitez pas à me contacter directement.";

  return renderEmail({
    subject: `Renseignez votre premier site sur Bénéfriches${NBSP}!`,
    preheader: `Quelques informations suffisent${NBSP}: Bénéfriches complète les données manquantes.`,
    unsubscribeUrl: input.unsubscribeUrl,
    sections: [
      { type: "paragraph", html: escapeHtml(greeting), text: greeting },
      { type: "paragraph", html: escapeHtml(introParagraph), text: introParagraph },
      {
        type: "paragraph",
        html: escapeHtml(prefilledDataParagraph),
        text: prefilledDataParagraph,
      },
      { type: "button", label: "Renseigner mon site", url: ctaUrl },
      { type: "paragraph", html: escapeHtml(contactParagraph), text: contactParagraph },
      ...buildContactSections(input.contact),
    ],
  });
}
