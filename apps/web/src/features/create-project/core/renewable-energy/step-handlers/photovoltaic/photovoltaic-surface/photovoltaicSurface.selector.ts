import { createSelector } from "@reduxjs/toolkit";
import { getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower } from "shared";

import { selectSiteSurfaceArea } from "../../../../createProject.selectors";
import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type PhotovoltaicSurfaceAreaViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number | undefined;
      siteSurfaceArea: number;
      recommendedSurfaceArea: undefined;
      electricalPowerKWc: undefined;
    }
  | {
      keyParameter: "POWER";
      initialValue: number;
      siteSurfaceArea: number;
      recommendedSurfaceArea: number;
      electricalPowerKWc: number;
    };

export const selectPhotovoltaicSurfaceViewData = createSelector(
  [selectSteps, selectSiteSurfaceArea],
  (steps, siteSurfaceArea): PhotovoltaicSurfaceAreaViewData => {
    const keyParameter = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    )?.photovoltaicKeyParameter;
    const surfaceArea = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    )?.photovoltaicInstallationSurfaceSquareMeters;
    const electricalPowerKWc = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
    )?.photovoltaicInstallationElectricalPowerKWc;

    if (keyParameter === "SURFACE") {
      return {
        keyParameter: "SURFACE",
        initialValue: surfaceArea,
        siteSurfaceArea,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      };
    }

    const power = electricalPowerKWc ?? 0;
    const recommendedSurfaceArea = Math.min(
      getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower(power),
      siteSurfaceArea,
    );
    const initialValue = surfaceArea ?? recommendedSurfaceArea;
    return {
      keyParameter: "POWER",
      initialValue,
      recommendedSurfaceArea,
      siteSurfaceArea,
      electricalPowerKWc: power,
    };
  },
);
