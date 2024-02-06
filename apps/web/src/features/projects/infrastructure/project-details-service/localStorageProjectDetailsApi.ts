import {
  ProjectDetailsResult as ProjectImpactsResult,
  ProjectsDetailsGateway as ProjectImpactsGateway,
} from "../../application/projectImpacts.actions";
import {
  ProjectDetailsResult as ProjectImpactsComparisonResult,
  ProjectsDetailsGateway as ProjectImpactsComparisonGateway,
} from "../../application/projectImpactsComparison.actions";
import { ProjectSite } from "../../domain/projects.types";

import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { SoilType } from "@/shared/domain/soils";
import { LocalAutorityStructureType } from "@/shared/domain/stakeholder";
import { delay } from "@/shared/services/delay/delay";

export const PROJECTS_LIST_STORAGE_KEY = "benefriches/projects-list";

export type Stakeholder = {
  name: string;
  structureType: "company" | LocalAutorityStructureType | "other" | "unknown";
};

type ProjectInLocalStorage = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: Partial<Record<SoilType, number>>;
  futureOperator: Stakeholder;
  reinstatementContractOwner?: Stakeholder;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenue: number;
  yearlyProjectedCosts: {
    amount: number;
  }[];
  yearlyProjectedRevenue: {
    amount: number;
  }[];
};

export class LocalStorageProjectDetailsApi
  implements ProjectImpactsComparisonGateway, ProjectImpactsGateway
{
  async getProjectById(
    projectId: string,
  ): Promise<ProjectImpactsComparisonResult | ProjectImpactsResult> {
    await delay(300);

    try {
      const projectsFromLocalStorage = localStorage.getItem(PROJECTS_LIST_STORAGE_KEY);

      const projectsList = projectsFromLocalStorage
        ? (JSON.parse(projectsFromLocalStorage) as ProjectInLocalStorage[])
        : [];

      const project = projectsList.find((project) => project.id === projectId);

      if (!project) {
        return { projectData: undefined, siteData: undefined };
      }

      const sitesFromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);

      const sitesList = sitesFromLocalStorage
        ? (JSON.parse(sitesFromLocalStorage) as ProjectSite[])
        : [];

      const relatedSite = sitesList.find((site) => site.id === project.relatedSiteId);

      return { siteData: relatedSite, projectData: project };
    } catch (error) {
      return { projectData: undefined, siteData: undefined };
    }
  }
}
