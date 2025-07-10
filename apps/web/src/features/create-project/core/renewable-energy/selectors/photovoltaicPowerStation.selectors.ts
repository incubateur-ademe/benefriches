import { createSelector } from "@reduxjs/toolkit";
import {
  getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower,
  getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea,
} from "shared";

import { selectSiteSurfaceArea } from "../../createProject.selectors";
import { selectCreationData } from "./renewableEnergy.selector";

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(
  selectCreationData,
  (creationData): number => creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
);

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(
  selectCreationData,
  (creationData) => creationData.photovoltaicKeyParameter,
);

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
  [selectCreationData, selectSiteSurfaceArea],
  (creationData, siteSurfaceArea): PhotovoltaicPowerViewData => {
    if (creationData.photovoltaicKeyParameter === "SURFACE") {
      const installationSurfaceArea = creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0;
      const recommendedPowerKWc =
        getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(installationSurfaceArea);
      const initialValue =
        creationData.photovoltaicInstallationElectricalPowerKWc ?? recommendedPowerKWc;
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
      initialValue: creationData.photovoltaicInstallationElectricalPowerKWc,
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

export const selectPhotovoltaicSurfaceViewData = createSelector(
  [selectCreationData, selectSiteSurfaceArea],
  (creationData, siteSurfaceArea): PhotovoltaicSurfaceAreaViewData => {
    if (creationData.photovoltaicKeyParameter === "SURFACE") {
      return {
        keyParameter: "SURFACE",
        initialValue: creationData.photovoltaicInstallationSurfaceSquareMeters,
        siteSurfaceArea,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      };
    }

    const electricalPowerKWc = creationData.photovoltaicInstallationElectricalPowerKWc ?? 0;
    // photovoltaic plant can't be bigger than site
    const recommendedSurfaceArea = Math.min(
      getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower(electricalPowerKWc),
      siteSurfaceArea,
    );
    const initialValue =
      creationData.photovoltaicInstallationSurfaceSquareMeters ?? recommendedSurfaceArea;
    return {
      keyParameter: "POWER",
      initialValue,
      recommendedSurfaceArea,
      siteSurfaceArea,
      electricalPowerKWc,
    };
  },
);
