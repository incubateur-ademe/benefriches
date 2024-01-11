import { validate as uuidValidate } from "uuid";
import { Project, ProjectSite } from "../domain/projects.types";

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

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    "projectImpacts/fetchCurrentAndProjectedSoilsCarbonStorage",
    async (_, { extra, getState }) => {
      const { projectImpacts } = getState();
      const { projectData, siteData } = projectImpacts;

      if (!siteData || !projectData) {
        return Promise.reject(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing siteData or projectData",
        );
      }

      const { id: projectId } = projectData;

      if (!uuidValidate(projectId)) {
        return Promise.reject(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Wrong format for projectId",
        );
      }

      const cityCode = siteData.address.cityCode;
      const siteSoils = siteData.soilsSurfaceAreas;
      const projectSoils = projectData.soilsSurfaceAreas;

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

export interface ProjectsDetailsGateway {
  getProjectById(id: string): Promise<ProjectDetailsResult>;
}

export type ProjectDetailsResult = {
  projectData?: Project;
  siteData?: ProjectSite;
};

type FetchDataResult = {
  projectData: ProjectDetailsResult["projectData"];
  siteData: ProjectDetailsResult["siteData"];
};

export const fetchProjectAndSiteData = createAppAsyncThunk<FetchDataResult, string>(
  "projectImpacts/fetchProjectAndSiteData",
  async (projectId, { extra }) => {
    if (!uuidValidate(projectId)) {
      return Promise.reject("fetchProjectAndSiteData: Wrong format for projectId");
    }

    const { projectData, siteData } = await extra.projectDetailsService.getProjectById(projectId);

    return { projectData, siteData };
  },
);
