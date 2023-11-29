import { createAppAsyncThunk } from "@/appAsyncThunk";
import { SoilType } from "@/shared/domain/soils";

type Soils = { type: SoilType; surfaceArea: number }[];

type SoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
  }[];
};

export type ProjectAndSiteSoilsCarbonStorageResult = {
  siteCarbonStorage: SoilsCarbonStorageResult;
  projectCarbonStorage: SoilsCarbonStorageResult;
};

type Payload = { siteSoils: Soils; projectSoils: Soils; cityCode: string };

export const fetchCarbonStorageForSiteAndProjectSoils = createAppAsyncThunk<
  ProjectAndSiteSoilsCarbonStorageResult,
  Payload
>(
  "project/fetchCarbonStorageForSiteAndProjectSoils",
  async (payload, { extra }) => {
    const [siteCarbonStorage, projectCarbonStorage] = await Promise.all([
      await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
        cityCode: payload.cityCode,
        soils: payload.siteSoils,
      }),
      await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
        soils: payload.projectSoils,
        cityCode: payload.cityCode,
      }),
    ]);

    return {
      siteCarbonStorage,
      projectCarbonStorage,
    };
  },
);
