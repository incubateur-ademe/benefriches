import { GetReconversionProjectImpactsResultDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

export interface QuickUrbanProjectImpactsGateway {
  getImpacts(input: {
    siteSurfaceArea: number;
    siteCityCode: string;
  }): Promise<GetReconversionProjectImpactsResultDto>;
}

export const fetchQuickImpactsForUrbanProjectOnFriche = createAppAsyncThunk<
  GetReconversionProjectImpactsResultDto,
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
