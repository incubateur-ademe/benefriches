import {
  type SoilType,
  type SoilsDistribution,
  SurfaceAreaDistribution,
  typedObjectEntries,
} from "shared";

import { ReadStateHelper, getSelectedParcelTypes } from "../../helpers/stateHelpers";
import type { UrbanZoneStepsState } from "../../urbanZoneSteps";
import { getParcelStepIds } from "../per-parcel-soils/parcelStepMapping";

export function aggregateSoilsDistribution(stepsState: UrbanZoneStepsState): SoilsDistribution {
  const selectedTypes = getSelectedParcelTypes(stepsState);
  const aggregated = new SurfaceAreaDistribution<SoilType>();

  for (const parcelType of selectedTypes) {
    const stepId = getParcelStepIds(parcelType).soilsDistribution;
    const stepAnswers = ReadStateHelper.getStepAnswers(stepsState, stepId);
    const soilsDistribution = stepAnswers?.soilsDistribution;
    if (soilsDistribution) {
      for (const [soilType, area] of typedObjectEntries(soilsDistribution)) {
        aggregated.addSurface(soilType, area ?? 0);
      }
    }
  }

  return aggregated.toJSON();
}
