import { getProjectSoilDistributionByType, typedObjectEntries } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { WizardFormState } from "../../../wizardForm.reducer";

type Steps = WizardFormState["urbanProject"]["steps"];

export function getProjectSoilDistribution(steps: Steps) {
  const publicGreenSpacesSoilsDistribution = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
  )?.publicGreenSpacesSoilsDistribution;

  const spacesSurfaceAreaDistribution = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_PROJECT_SPACES_SURFACE_AREA",
  )?.spacesSurfaceAreaDistribution;

  return [
    ...typedObjectEntries(publicGreenSpacesSoilsDistribution ?? {})
      .filter(([, surfaceArea]) => surfaceArea)
      .map(([soilType, surfaceArea = 0]) => ({
        surfaceArea,
        soilType,
        spaceCategory: "PUBLIC_GREEN_SPACE" as const,
      })),
    ...typedObjectEntries(spacesSurfaceAreaDistribution ?? {})
      .filter(([, surfaceArea]) => surfaceArea)
      .map(([soilType, surfaceArea = 0]) => ({
        surfaceArea,
        soilType,
      })),
  ];
}

export function getProjectSoilDistributionBySoilType(steps: Steps) {
  return getProjectSoilDistributionByType(getProjectSoilDistribution(steps));
}
