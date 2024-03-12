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
      greenSoil: {
        base: number;
        forecast: number;
      };
      mineralSoil: {
        base: number;
        forecast: number;
      };
    };
    contaminatedSurfaceArea?: { base: number; forecast: number };
  };
};

export const fetchReconversionProjectImpacts = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  string
>("projectImpacts/fetchReconversionProjectImpacts", async (projectId, { extra }) => {
  const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(projectId);

  return data;
});
