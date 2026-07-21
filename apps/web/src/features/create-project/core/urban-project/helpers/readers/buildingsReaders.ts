import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { UrbanProjectStepsState } from "../../urbanProject.state";

type Steps = UrbanProjectStepsState;

export function willHaveBuildings(steps: Steps): boolean {
  const selectedUses =
    ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];
  return selectedUses.some((use) => doesUseIncludeBuildings(use));
}

export function hasBuildingsResalePlannedAfterDevelopment(steps: Steps): boolean | undefined {
  return ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION")
    ?.buildingsResalePlannedAfterDevelopment;
}
