import { ReconversionProjectImpacts } from "shared";

import { ReconversionProjectImpactsResult } from "../application/fetchImpactsForReconversionProject.action";

export type SocialAreaChartImpactsData = {
  fullTimeJobs: ReconversionProjectImpacts["social"]["fullTimeJobs"];
  householdsPoweredByRenewableEnergy: ReconversionProjectImpacts["social"]["householdsPoweredByRenewableEnergy"];
};

export const getSocialAreaChartImpactsData = (
  impactsData?: ReconversionProjectImpactsResult["impacts"],
): SocialAreaChartImpactsData => {
  return {
    fullTimeJobs: impactsData?.social.fullTimeJobs,
    householdsPoweredByRenewableEnergy: impactsData?.social.householdsPoweredByRenewableEnergy,
  };
};

export type EnvironmentalAreaChartImpactsData = {
  avoidedCo2eqEmissions?: {
    base: number;
    forecast: number;
    difference: number;
    withAirConditioningDiminution: {
      base: 0;
      forecast: number;
    };
    withCarTrafficDiminution: {
      base: 0;
      forecast: number;
    };
    withRenewableEnergyProduction: {
      base: 0;
      forecast: number;
    };
    soilsCo2eqStorage: {
      base: number;
      forecast: number;
    };
  };
  nonContaminatedSurfaceArea?: ReconversionProjectImpacts["environmental"]["nonContaminatedSurfaceArea"];
  permeableSurfaceArea?: ReconversionProjectImpacts["environmental"]["permeableSurfaceArea"];
  soilsCarbonStorage?: ReconversionProjectImpacts["environmental"]["soilsCarbonStorage"];
};

type Input = {
  siteContaminatedSurfaceArea?: number;
  projectContaminatedSurfaceArea?: number;
  impactsData?: ReconversionProjectImpactsResult["impacts"];
};
export const getEnvironmentalAreaChartImpactsData = ({
  siteContaminatedSurfaceArea = 0,
  projectContaminatedSurfaceArea = 0,
  impactsData,
}: Input): EnvironmentalAreaChartImpactsData => {
  const displayNonContaminatedSurface =
    siteContaminatedSurfaceArea > 0 && siteContaminatedSurfaceArea > projectContaminatedSurfaceArea;

  const environmentalAreaChartImpactsData = {
    nonContaminatedSurfaceArea: displayNonContaminatedSurface
      ? impactsData?.environmental.nonContaminatedSurfaceArea
      : undefined,
    permeableSurfaceArea: impactsData?.environmental.permeableSurfaceArea,
    soilsCarbonStorage: impactsData?.environmental.soilsCarbonStorage,
  };

  if (impactsData?.environmental.avoidedCo2eqEmissions) {
    const { forecast: forecastSoilsCo2eqStorage = 0, base: baseSoilsCo2eqStorage = 0 } =
      impactsData.environmental.soilsCo2eqStorage ?? {};

    const {
      withAirConditioningDiminution = 0,
      withCarTrafficDiminution = 0,
      withRenewableEnergyProduction = 0,
    } = impactsData.environmental.avoidedCo2eqEmissions;

    const forecast =
      withAirConditioningDiminution +
      withCarTrafficDiminution +
      withRenewableEnergyProduction +
      forecastSoilsCo2eqStorage;

    const difference = forecast - baseSoilsCo2eqStorage;

    if (Math.abs(difference) < 1) {
      return environmentalAreaChartImpactsData;
    }

    return {
      ...environmentalAreaChartImpactsData,
      avoidedCo2eqEmissions: {
        base: baseSoilsCo2eqStorage,
        forecast: forecast,
        difference,
        withAirConditioningDiminution: {
          base: 0,
          forecast: withAirConditioningDiminution,
        },
        withCarTrafficDiminution: {
          base: 0,
          forecast: withCarTrafficDiminution,
        },
        withRenewableEnergyProduction: {
          base: 0,
          forecast: withRenewableEnergyProduction,
        },
        soilsCo2eqStorage: {
          base: baseSoilsCo2eqStorage,
          forecast: forecastSoilsCo2eqStorage,
        },
      },
    };
  }

  return environmentalAreaChartImpactsData;
};
