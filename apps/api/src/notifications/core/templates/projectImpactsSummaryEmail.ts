import type { BreakEvenHorizon, KeyImpactIndicatorData, ZanComplianceIndicator } from "shared";

import type { LifecycleEmailProject } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import {
  escapeHtml,
  renderEmail,
  type EmailSection,
  type RenderedEmail,
} from "src/notifications/core/templates/emailLayout";
import {
  buildBreakEvenCard,
  buildMainImpactIndicatorCard,
  buildZanComplianceCard,
} from "src/notifications/core/templates/projectImpactsSummaryCards";
import { NBSP } from "src/notifications/core/templates/reminderGreeting";

// Already derived by the shared indicator functions (services/projectImpactsSummaryContent.ts),
// so the template takes literal inputs and the preview samples stay synchronous.
export type ProjectImpactsSummaryContent = {
  project: LifecycleEmailProject;
  // 30 (photovoltaic plant) or 50: the "Sur <n> ans" of the break-even card.
  evaluationPeriodInYears: number;
  zanCompliance: ZanComplianceIndicator | undefined;
  breakEvenHorizon: BreakEvenHorizon;
  mainImpactIndicator: KeyImpactIndicatorData | undefined;
};

export type BuildProjectImpactsSummaryEmailInput = ProjectImpactsSummaryContent & {
  webappUrl: string;
  unsubscribeUrl: string;
};

// "1er" for the first day of the month, as French dates are written. Europe/Paris, not the
// server's zone (UTC in production): a project created at 00:30 in Paris is dated that day.
const formatEvaluationDate = (date: Date): string =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  })
    .formatToParts(date)
    .map(({ type, value }) => (type === "day" && value === "1" ? "1er" : value))
    .join("");

// Copy transcribed from the mockup (assets/04-project-impacts-summary.png), with curly
// apostrophes; the cards' copy is the app's (projectImpactsSummaryCards.ts). No greeting, no
// closing paragraph, and no map, chart or image: the mockup's map is struck through,
// and the welcome email's icons are the only images lifecycle emails carry.
export function buildProjectImpactsSummaryEmail(
  input: BuildProjectImpactsSummaryEmailInput,
): RenderedEmail {
  const { project } = input;
  // The name is user input: a newline has no place in a header.
  const subjectSiteName = project.siteName.replace(/\s+/g, " ").trim();
  // Never a hardcoded domain: always built from the injected webapp URL. The paths are the web
  // routes projectImpacts, projectImpactsBreakEvenLevel and projectAvoidedCostsAnalysis.
  const projectUrl = (page: string): string =>
    new URL(`/mes-projets/${encodeURIComponent(project.id)}/${page}`, input.webappUrl).toString();

  // French guillemets with non-breaking spaces inside, as product chose for the first project
  // reminder (BEN-37); the mockup had “ ”.
  const intro = (projectName: string, siteName: string): string =>
    `Voici les résultats de l’évaluation socio-économique du projet «${NBSP}${projectName}${NBSP}» sur le site «${NBSP}${siteName}${NBSP}».`;
  // TODO(product): the evaluation date is the project's creation date (plan P5).
  const evaluationDate = `Évaluation réalisée le ${formatEvaluationDate(project.createdAt)}`;

  // No ZAN indicator: no card 1 (type-level only, the derivation always yields one). No main
  // indicator: no card 3 (decisions.md).
  const zanComplianceCard = input.zanCompliance
    ? buildZanComplianceCard(input.zanCompliance, {
        label: "Voir le détail des impacts",
        url: projectUrl("impacts"),
      })
    : undefined;
  const breakEvenCard = buildBreakEvenCard(input.breakEvenHorizon, input.evaluationPeriodInYears, {
    label: "Voir l’analyse coût-bénéfice",
    url: projectUrl("analyse-cout-benefice"),
  });
  const mainImpactIndicatorCard = input.mainImpactIndicator
    ? buildMainImpactIndicatorCard(input.mainImpactIndicator, {
        label: "Voir l’analyse des coûts évités",
        url: projectUrl("analyse-couts-evites"),
      })
    : undefined;

  const sections: EmailSection[] = [
    {
      type: "paragraph",
      html: intro(escapeHtml(project.name), escapeHtml(project.siteName)),
      text: intro(project.name, project.siteName),
    },
    {
      type: "paragraph",
      html: `<span style="font-size:14px;">${escapeHtml(evaluationDate)}</span>`,
      text: evaluationDate,
    },
    ...(zanComplianceCard ? [zanComplianceCard] : []),
    breakEvenCard,
    ...(mainImpactIndicatorCard ? [mainImpactIndicatorCard] : []),
  ];

  return renderEmail({
    // TODO(product): the mockup reads "Projet sur l’ancienne carrière…", an article added by
    // hand; we cannot generate articles, so the site name is used as typed (plan P1).
    subject: `Projet sur ${subjectSiteName}${NBSP}: résultats de votre évaluation`,
    preheader:
      "Les impacts socio-économiques de votre projet, comparés au maintien du site en l’état.",
    unsubscribeUrl: input.unsubscribeUrl,
    sections,
  });
}
