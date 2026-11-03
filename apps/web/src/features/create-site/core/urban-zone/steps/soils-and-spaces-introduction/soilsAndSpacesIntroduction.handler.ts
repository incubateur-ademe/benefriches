import type { InfoStepHandler } from "../../stepHandlerRegistry";

export const SoilsAndSpacesIntroductionHandler = {
  stepId: "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_MISSING_INFORMATION";
  },
} satisfies InfoStepHandler;
