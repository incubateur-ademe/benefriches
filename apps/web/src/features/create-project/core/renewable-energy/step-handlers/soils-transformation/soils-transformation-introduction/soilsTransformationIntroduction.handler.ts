import { canSiteAccomodatePhotovoltaicPanels } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsTransformationIntroductionHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",

  getPreviousStepId(params) {
    if (!params.context.siteData?.contaminatedSoilSurface) {
      return "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION";
    }
    if (
      ReadStateHelper.getStepAnswers(
        params.answers,
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
      )?.decontaminationPlan === "partial"
    ) {
      return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA";
    }
    return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION";
  },

  getNextStepId(params) {
    const surfaceArea =
      ReadStateHelper.getStepAnswers(params.answers, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
        ?.photovoltaicInstallationSurfaceSquareMeters ?? 0;

    return canSiteAccomodatePhotovoltaicPanels(
      params.context.siteData?.soilsDistribution ?? {},
      surfaceArea,
    )
      ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"
      : "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE";
  },
};
