import { FricheActivity, ReconversionProjectImpacts, SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export interface QuickUrbanProjectImpactsGateway {
  getImpacts(input: {
    siteSurfaceArea: number;
    siteCityCode: string;
  }): Promise<ReconversionProjectImpactsResult>;
}

export type ReconversionProjectImpactsResult = {
  id: string;
  name: string;
  relatedSiteId: string;
  relatedSiteName: string;
  isExpressSite: boolean;
  projectData: {
    isExpressProject: boolean;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: number;
    developmentPlan:
      | {
          type: "PHOTOVOLTAIC_POWER_PLANT";
          electricalPowerKWc: number;
          surfaceArea: number;
        }
      | {
          type: "URBAN_PROJECT";
          buildingsFloorAreaDistribution: {
            GROUND_FLOOR_RETAIL?: number;
            RESIDENTIAL?: number;
          };
        };
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
    surfaceArea: number;
    isFriche: boolean;
    fricheActivity: FricheActivity;
    owner: {
      structureType: string;
      name: string;
    };
  };
  impacts: ReconversionProjectImpacts;
};

export const fetchQuickImpactsForUrbanProjectOnFriche = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  { siteSurfaceArea: number; siteCityCode: string }
>(
  "projectImpacts/fetchQuickImpactsForUrbanProjectOnFriche",
  async ({ siteSurfaceArea, siteCityCode }, { extra }) => {
    const data = await extra.quickUrbanProjectImpactsService.getImpacts({
      siteSurfaceArea,
      siteCityCode,
    });

    return data;
  },
);
