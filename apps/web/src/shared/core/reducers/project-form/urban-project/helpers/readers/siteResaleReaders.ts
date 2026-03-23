import type { ProjectFormState } from "../../../projectForm.reducer";
import { ReadStateHelper } from "../readState";

type Steps = ProjectFormState["urbanProject"]["steps"];

export function getSiteResaleSelection(steps: Steps) {
  return ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SITE_RESALE_SELECTION")
    ?.siteResaleSelection;
}

export function isSiteResalePlannedAfterDevelopment(steps: Steps): boolean {
  const selection = getSiteResaleSelection(steps);
  return selection === "yes" || selection === "unknown";
}

export function shouldSiteResalePriceBeEstimated(steps: Steps): boolean {
  return getSiteResaleSelection(steps) === "unknown";
}
