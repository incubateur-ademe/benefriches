import { createAppAsyncThunk } from "@/appAsyncThunk";
import { SoilType } from "@/shared/domain/soils";

export type SoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
  }[];
};

export type CurrentAndProjectedSoilsCarbonStorageResult = {
  current: SoilsCarbonStorageResult;
  projected: SoilsCarbonStorageResult;
};

export type GetSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: { type: SoilType; surfaceArea: number }[];
};

export interface SoilsCarbonStorageGateway {
  getForCityCodeAndSoils(payload: GetSoilsCarbonStoragePayload): Promise<SoilsCarbonStorageResult>;
}

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    "project/fetchCurrentAndProjectedSoilsCarbonStorage",
    async (_, { extra, getState }) => {
      const { projectCreation } = getState();
      const cityCode = projectCreation.siteData?.address.cityCode;
      const siteSoils = projectCreation.siteData?.soilsSurfaceAreas ?? {};
      const projectSoils = projectCreation.projectData.soilsSurfaceAreas ?? {};

      if (!cityCode) {
        return Promise.reject("fetchCurrentAndProjectedSoilsCarbonStorage: Missing city code");
      }

      const [current, projected] = await Promise.all([
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode,
          soils: Object.entries(siteSoils).map(([type, surfaceArea]) => ({
            type: type as SoilType,
            surfaceArea,
          })),
        }),
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          soils: Object.entries(projectSoils).map(([type, surfaceArea]) => ({
            type: type as SoilType,
            surfaceArea,
          })),
          cityCode,
        }),
      ]);

      return {
        current,
        projected,
      };
    },
  );
