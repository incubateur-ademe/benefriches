import {
  Address,
  FricheActivity,
  ReconversionProjectImpacts,
  SiteNature,
  SoilsDistribution,
} from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ProjectFeatures } from "../../domain/projects.types";

type Props = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
  comparisonSiteNature: SiteNature;
};

export interface UrbanSprawlImpactsComparisonGateway {
  getImpactsUrbanSprawlComparison({
    reconversionProjectId,
    evaluationPeriodInYears,
  }: Props): Promise<UrbanSprawlImpactsComparisonResult>;
}

export type SiteData = {
  id: string;
  name: string;
  nature: SiteNature;
  isExpressSite: boolean;
  owner: {
    name?: string;
    structureType: string;
  };
  tenant?: {
    name?: string;
    structureType?: string;
  };
  hasContaminatedSoils?: boolean;
  contaminatedSoilSurface?: number;
  soilsDistribution: SoilsDistribution;
  surfaceArea: number;
  address: Address;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
  yearlyExpenses: { amount: number; purpose: string }[];
  yearlyIncomes: { amount: number; source: string }[];
  fricheActivity?: FricheActivity;
  agriculturalOperationActivity?: string;
  naturalAreaType?: string;
  description?: string;
};

export type UrbanSprawlImpactsComparisonResult = {
  projectData: ProjectFeatures;
  baseCase: {
    siteData: SiteData;
    impacts: ReconversionProjectImpacts;
  };
  comparisonCase: {
    siteData: SiteData;
    impacts: ReconversionProjectImpacts;
  };
};

export const fetchUrbanSprawlImpactsComparison = createAppAsyncThunk<
  UrbanSprawlImpactsComparisonResult,
  { evaluationPeriod: number; projectId: string; comparisonSiteNature: SiteNature }
>(
  "urbanSprawlComparison/fetchImpactsUrbanSprawlComparison",
  async ({ projectId, evaluationPeriod, comparisonSiteNature }, { extra }) => {
    const data = await extra.urbanSprawlImpactsComparisonService.getImpactsUrbanSprawlComparison({
      reconversionProjectId: projectId,
      evaluationPeriodInYears: evaluationPeriod,
      comparisonSiteNature,
    });

    return data;
  },
);
