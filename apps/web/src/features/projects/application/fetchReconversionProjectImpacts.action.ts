import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface ReconversionProjectImpactsGateway {
  getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsResult>;
}

export type ReconversionProjectImpactsResult = {
  id: string;
  name: string;
  relatedSiteId: string;
  relatedSiteName: string;
  impacts: {
    permeableSurfaceArea: {
      base: number;
      forecast: number;
      difference: number;
      greenSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
      mineralSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
    };
    contaminatedSurfaceArea?: { base: number; forecast: number; difference: number };
  };
};

export const fetchReconversionProjectImpacts = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  string
>("projectImpacts/fetchReconversionProjectImpacts", async (projectId, { extra }) => {
  const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(projectId);

  return data;
});
