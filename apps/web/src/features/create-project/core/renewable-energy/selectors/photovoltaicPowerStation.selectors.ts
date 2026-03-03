import { createSelector } from "@reduxjs/toolkit";
import {
  getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower,
  getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea,
} from "shared";

import { RootState } from "@/app/store/store";

import { selectSiteData, selectSiteSurfaceArea } from "../../createProject.selectors";
import { ReadStateHelper } from "../helpers/readState";
import { selectRenewableEnergyType, selectSteps } from "./renewableEnergy.selector";

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(selectSteps, (steps): number => {
  return (
    ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      ?.photovoltaicInstallationSurfaceSquareMeters ?? 0
  );
});

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(selectSteps, (steps) => {
  return ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER")
    ?.photovoltaicKeyParameter;
});

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
export const selectPhotovoltaicPowerViewData = createSelector(
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
      initialValue: powerKWc,
      keyParameter: "POWER",
      recommendedPowerKWc,
      photovoltaicInstallationSurfaceArea: undefined,
      siteSurfaceArea,
    };
  },
);

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

const selectSoilsCarbonStorage = (state: RootState) =>
  state.projectCreation.renewableEnergyProject.soilsCarbonStorage;

export const selectPhotovoltaicSummaryViewData = createSelector(
  [selectSteps, selectSiteData, selectSoilsCarbonStorage, selectRenewableEnergyType],
  (steps, siteData, soilsCarbonStorage, renewableEnergyType) => ({
    steps,
    siteData,
    renewableEnergyType,
    siteSoilsCarbonStorage: soilsCarbonStorage.current,
    projectSoilsCarbonStorage: soilsCarbonStorage.projected,
  }),
);

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
