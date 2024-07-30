import { SoilsDistribution } from "shared";
import { ReconversionProjectImpacts } from "../domain/impacts.types";
import { ProjectDevelopmentPlanType } from "../domain/projects.types";

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
    contaminatedSoilSurface: 0;
    developmentPlan: {
      surfaceArea?: number;
      electricalPowerKWc?: number;
      type?: ProjectDevelopmentPlanType;
    };
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
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
