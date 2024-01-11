import { validate as uuidValidate } from "uuid";
import { Project, ProjectSite } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";
import { SoilType } from "@/shared/domain/soils";

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
    "projectImpactsComparison/fetchCurrentAndProjectedSoilsCarbonStorage",
    async (_, { extra, getState }) => {
      const { projectImpactsComparison } = getState();
      const { withProject, baseProjectId } = projectImpactsComparison;

      if (!baseProjectId || !uuidValidate(baseProjectId)) {
        return Promise.reject(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Wrong format for baseProjectId",
        );
      }

      const { siteData, projectData, otherProjectData } = projectImpactsComparison;

      if (!siteData || !projectData) {
        return Promise.reject(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing siteData or projectData",
        );
      }

      const cityCode = siteData.address.cityCode;
      const siteSoils = siteData.soilsSurfaceAreas;
      const projectSoils = projectData.soilsSurfaceAreas;
      const otherProjectSoils = otherProjectData?.soilsSurfaceAreas ?? {};

      const currentSoils = withProject === "STATU_QUO" ? siteSoils : projectSoils;
      const projectedSoils = withProject === "STATU_QUO" ? projectSoils : otherProjectSoils;

      const [current, projected] = await Promise.all([
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode,
          soils: Object.entries(currentSoils).map(([type, surfaceArea]) => ({
            type: type as SoilType,
            surfaceArea,
          })),
        }),
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          soils: Object.entries(projectedSoils).map(([type, surfaceArea]) => ({
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

export type ProjectDetailsResult = {
  projectData?: Project;
  siteData?: ProjectSite;
};

type FetchDataResult = {
  projectData: ProjectDetailsResult["projectData"];
  siteData: ProjectDetailsResult["siteData"];
  otherProjectData?: ProjectDetailsResult["projectData"];
  baseProjectId: string;
  withProject: string;
};

export interface ProjectsDetailsGateway {
  getProjectById(id: string): Promise<ProjectDetailsResult>;
}

export const fetchBaseProjectAndWithProjectData = createAppAsyncThunk<
  FetchDataResult,
  { baseProjectId: string; withProject: string }
>(
  "projectImpactsComparison/fetchBaseProjectAndWithProjectData",
  async ({ baseProjectId, withProject }, { extra }) => {
    if (!uuidValidate(baseProjectId)) {
      return Promise.reject("fetchBaseProjectAndWithProjectData: Wrong format for baseProjectId");
    }

    const { projectData, siteData } =
      await extra.projectDetailsService.getProjectById(baseProjectId);

    if (uuidValidate(withProject)) {
      const { projectData: otherProjectData } =
        await extra.projectDetailsService.getProjectById(withProject);
      return {
        projectData,
        siteData,
        otherProjectData,
        baseProjectId,
        withProject,
      };
    } else if (withProject === "STATU_QUO") {
      return { projectData, siteData, baseProjectId, withProject };
    }

    return Promise.reject("fetchBaseProjectAndWithProjectData: Wrong format for withProject");
  },
);
