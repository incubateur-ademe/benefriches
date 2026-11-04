// The three headline cards of the project impacts summary. Their copy is the web Synthèse's, from
// shared, so the email and the app read the same; the email adds each card's link.
import {
  getBreakEvenCardContent,
  getAvoidedCostsAnalysisCardContent,
  getDevelopmentScoreCardContent,
  type BreakEvenHorizon,
  type SummaryCardContent,
  type AvoidedCostsAnalysisData,
  type DevelopmentScoreCardInput,
} from "shared";

import type { EmailSection } from "src/notifications/core/templates/emailLayout";

type CardSection = Extract<EmailSection, { type: "card" }>;
type CardLink = CardSection["link"];

const toCardSection = (content: SummaryCardContent, link: CardLink): CardSection => ({
  type: "card",
  ...content,
  link,
});

export const buildDevelopmentScoreCard = (
  developmentScore: DevelopmentScoreCardInput,
  link: CardLink,
): CardSection => toCardSection(getDevelopmentScoreCardContent(developmentScore), link);

export const buildBreakEvenCard = (
  breakEvenHorizon: BreakEvenHorizon,
  evaluationPeriodInYears: number,
  link: CardLink,
): CardSection =>
  toCardSection(getBreakEvenCardContent(breakEvenHorizon, evaluationPeriodInYears), link);

export const buildAvoidedCostsAnalysisCard = (
  avoidedCostsAnalysisData: AvoidedCostsAnalysisData,
  link: CardLink,
): CardSection | undefined => {
  const content = getAvoidedCostsAnalysisCardContent(avoidedCostsAnalysisData);
  return toCardSection(content, link);
};
