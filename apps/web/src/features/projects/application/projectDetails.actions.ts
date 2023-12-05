import { ProjectDetailsResult } from "../infrastructure/project-details-service/localStorageProjectDetailsApi";

import { createAppAsyncThunk } from "@/appAsyncThunk";
import { SoilType } from "@/shared/domain/soils";

export interface ProjectsDetailsGateway {
  getProjectById(id: string): Promise<ProjectDetailsResult>;
}

type SoilsCarbonStorageResult = {
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

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    "projectDetails/fetchCurrentAndProjectedSoilsCarbonStorage",
    async (_, { extra, getState }) => {
      const { projectDetails } = getState();
      const cityCode = projectDetails.siteData?.address?.cityCode;
      const siteSoils = projectDetails.siteData?.soilsSurfaceAreas ?? {};
      const projectSoils = projectDetails.projectData?.soilsSurfaceAreas ?? {};

      if (!cityCode || !siteSoils || !projectSoils) {
        return Promise.reject(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing parameters",
        );
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

export const fetchProjectDetails = createAppAsyncThunk<
  ProjectDetailsResult,
  string
>("projects/fetchProjectDetails", async (projectId, { extra }) => {
  const result = await extra.projectDetailsService.getProjectById(projectId);
  return result;
});
