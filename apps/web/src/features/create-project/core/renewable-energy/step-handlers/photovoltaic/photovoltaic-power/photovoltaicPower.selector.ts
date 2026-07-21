import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type PhotovoltaicPowerViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number;
      photovoltaicInstallationSurfaceArea: number;
      recommendedPowerKWc: number;
      siteSurfaceArea: number;
    }
  | {
      keyParameter: "POWER";
      initialValue: number | undefined;
      recommendedPowerKWc: number;
      photovoltaicInstallationSurfaceArea: undefined;
      siteSurfaceArea: number;
    };
export const createSelectPhotovoltaicPowerViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectSteps, selectSiteSurfaceArea],
    (steps, siteSurfaceArea): PhotovoltaicPowerViewData => {
      const keyParameter = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
      )?.photovoltaicKeyParameter;
      const powerKWc = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
      )?.photovoltaicInstallationElectricalPowerKWc;
      const surfaceArea = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
      )?.photovoltaicInstallationSurfaceSquareMeters;

      if (keyParameter === "SURFACE") {
        const installationSurfaceArea = surfaceArea ?? 0;
        const recommendedPowerKWc =
          getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(installationSurfaceArea);
        const initialValue = powerKWc ?? recommendedPowerKWc;
        return {
          initialValue,
          keyParameter: "SURFACE",
          photovoltaicInstallationSurfaceArea: installationSurfaceArea,
          recommendedPowerKWc,
          siteSurfaceArea,
        };
      }
      const recommendedPowerKWc =
        getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(siteSurfaceArea);
      return {
        initialValue: powerKWc ?? recommendedPowerKWc,
        keyParameter: "POWER",
        recommendedPowerKWc,
        photovoltaicInstallationSurfaceArea: undefined,
        siteSurfaceArea,
      };
    },
  );
