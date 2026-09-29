import type { DevelopmentPlanType } from "../../reconversion-projects";

// The evaluation period the impacts pages open on: a photovoltaic plant is assessed over its
// operating life (30 years), every other project over 50.
export const getDefaultEvaluationPeriodInYears = (
  developmentPlanType: DevelopmentPlanType,
): number => (developmentPlanType === "PHOTOVOLTAIC_POWER_PLANT" ? 30 : 50);
