import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

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

export const createSelectPhotovoltaicSurfaceViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
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
