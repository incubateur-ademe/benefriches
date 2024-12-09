import { FricheActivity, ReconversionProjectImpacts, SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface ReconversionProjectImpactsGateway {
  getReconversionProjectImpacts(
    reconversionProjectId: string,
    evaluationPeriodInYears: number,
  ): Promise<ReconversionProjectImpactsResult>;
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

export const fetchReconversionProjectImpacts = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  { evaluationPeriod: number; projectId: string }
>(
  "projectImpacts/fetchReconversionProjectImpacts",
  async ({ projectId, evaluationPeriod }, { extra }) => {
    const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(
      projectId,
      evaluationPeriod,
    );

    return data;
  },
);
