import type { UrbanZoneLandParcelType } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { AnswersByStep, UrbanZoneStepsState } from "./urbanZoneSteps";

export { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

export function getSelectedParcelTypes(stepsState: UrbanZoneStepsState): UrbanZoneLandParcelType[] {
  return (
    ReadStateHelper.getStepAnswers<AnswersByStep, "URBAN_ZONE_LAND_PARCELS_SELECTION">(
      stepsState,
      "URBAN_ZONE_LAND_PARCELS_SELECTION",
    )?.landParcelTypes ?? []
  );
}
