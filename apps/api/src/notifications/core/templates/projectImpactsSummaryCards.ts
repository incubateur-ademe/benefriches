// The three headline cards of the project impacts summary. Their copy is the web Synthèse's, from
// shared, so the email and the app read the same; the email adds each card's link.
import {
  getBreakEvenCardContent,
  getMainImpactIndicatorCardContent,
  getZanComplianceCardContent,
  type BreakEvenHorizon,
  type KeyImpactIndicatorData,
  type SummaryCardContent,
  type ZanComplianceIndicator,
} from "shared";

import type { EmailSection } from "src/notifications/core/templates/emailLayout";

type CardSection = Extract<EmailSection, { type: "card" }>;
type CardLink = CardSection["link"];

const toCardSection = (content: SummaryCardContent, link: CardLink): CardSection => ({
  type: "card",
  ...content,
  link,
});

export const buildZanComplianceCard = (
  zanCompliance: ZanComplianceIndicator,
  link: CardLink,
): CardSection => toCardSection(getZanComplianceCardContent(zanCompliance), link);

export const buildBreakEvenCard = (
  breakEvenHorizon: BreakEvenHorizon,
  evaluationPeriodInYears: number,
  link: CardLink,
): CardSection =>
  toCardSection(getBreakEvenCardContent(breakEvenHorizon, evaluationPeriodInYears), link);

export const buildMainImpactIndicatorCard = (
  indicator: KeyImpactIndicatorData,
  link: CardLink,
): CardSection | undefined => {
  const content = getMainImpactIndicatorCardContent(indicator);
  return content ? toCardSection(content, link) : undefined;
};
