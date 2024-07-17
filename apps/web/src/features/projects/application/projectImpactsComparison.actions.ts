import { SoilType } from "shared";
import { validate as uuidValidate } from "uuid";
import { ProjectForComparison, ProjectSite } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

type SoilsCarbonStorage = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

export type CurrentAndProjectedSoilsCarbonStorageResult = {
  current: SoilsCarbonStorage;
  projected: SoilsCarbonStorage;
};

export const fetchCurrentAndProjectedSoilsCarbonStorage =
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    "projectImpactsComparison/fetchCurrentAndProjectedSoilsCarbonStorage",
    async (_, { extra, getState }) => {
      const { projectImpactsComparison } = getState();
      const { withScenario, baseScenario } = projectImpactsComparison;
      const { projectData: baseProjectData, siteData: baseSiteData, type } = baseScenario;
      const { projectData: withProjectData, siteData: withProjectSiteData } = withScenario;

      if (!baseSiteData) {
        throw new Error(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing base siteData or projectData",
        );
      }

      if (type !== "STATU_QUO" && !baseProjectData) {
        throw new Error(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing base siteData or projectData",
        );
      }

      if (!withProjectSiteData || !withProjectData) {
        throw new Error(
          "fetchCurrentAndProjectedSoilsCarbonStorage: Missing with siteData or projectData",
        );
      }

      const baseCityCode = baseSiteData.address.cityCode;
      const withCityCode = withProjectSiteData.address.cityCode;
      const currentSoils =
        type === "STATU_QUO"
          ? baseSiteData.soilsDistribution
          : baseProjectData?.soilsDistribution || {};
      const projectedSoils = withProjectData.soilsDistribution;

      const [current, projected] = await Promise.all([
        await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode: baseCityCode,
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
          cityCode: withCityCode,
        }),
      ]);

      return {
        current,
        projected,
      };
    },
  );

export type ProjectDetailsResult = {
  projectData?: ProjectForComparison;
  siteData?: ProjectSite;
};

type FetchDataResult = {
  baseScenario: {
    type: "STATU_QUO" | "PROJECT";
    id: string;
    projectData?: ProjectForComparison;
    siteData: ProjectSite;
  };
  withScenario: {
    type: "PROJECT";
    id: string;
    projectData: ProjectForComparison;
    siteData: ProjectSite;
  };
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
      throw new Error("fetchBaseProjectAndWithProjectData: Wrong format for baseProjectId");
    }

    const { projectData, siteData } =
      await extra.projectDetailsService.getProjectById(baseProjectId);

    if (!projectData || !siteData) {
      throw new Error("fetchBaseProjectAndWithProjectData: base project or base site not found");
    }

    if (withProject === "STATU_QUO") {
      return {
        baseScenario: {
          type: "STATU_QUO",
          id: siteData.id,
          siteData,
        },
        withScenario: {
          type: "PROJECT",
          id: baseProjectId,
          projectData,
          siteData,
        },
      };
    }

    if (!uuidValidate(withProject)) {
      throw new Error("fetchBaseProjectAndWithProjectData: Wrong format for withProject");
    }

    const { projectData: otherProjectData, siteData: otherProjectSiteData } =
      await extra.projectDetailsService.getProjectById(withProject);

    if (!otherProjectData || !otherProjectSiteData) {
      throw new Error("fetchBaseProjectAndWithProjectData: base project or base site not found");
    }

    return {
      baseScenario: {
        type: "PROJECT",
        id: baseProjectId,
        projectData,
        siteData,
      },
      withScenario: {
        type: "PROJECT",
        id: withProject,
        projectData: otherProjectData,
        siteData: otherProjectSiteData,
      },
    };
  },
);
