import { LocalAuthority, SoilsDistribution } from "shared";
import {
  ProjectDetailsResult as ProjectImpactsComparisonResult,
  ProjectsDetailsGateway as ProjectImpactsComparisonGateway,
} from "../../application/projectImpactsComparison.actions";
import { ProjectForComparison, ProjectSite } from "../../domain/projects.types";

import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

export const PROJECTS_LIST_STORAGE_KEY = "benefriches/projects-list";

export type Stakeholder = {
  name: string;
  structureType: "company" | LocalAuthority | "other" | "unknown";
};

type ProjectInLocalStorage = {
  id: string;
  name: string;
  relatedSiteId: string;
  soilsDistribution: SoilsDistribution;
  futureOperator: Stakeholder;
  reinstatementContractOwner?: Stakeholder;
  reinstatementCost?: number;
  photovoltaicPanelsInstallationCost: number;
  financialAssistanceRevenues: number;
  yearlyProjectedCosts: {
    amount: number;
  }[];
  yearlyProjectedRevenues: {
    amount: number;
  }[];
};

export class LocalStorageProjectDetailsApi implements ProjectImpactsComparisonGateway {
  async getProjectById(projectId: string): Promise<ProjectImpactsComparisonResult> {
    await delay(300);

    const projectsFromLocalStorage = localStorage.getItem(PROJECTS_LIST_STORAGE_KEY);

    const projectsList = projectsFromLocalStorage
      ? (JSON.parse(projectsFromLocalStorage) as ProjectInLocalStorage[])
      : [];

    const project = projectsList.find((project) => project.id === projectId);

    if (!project) throw new Error(`Could not find ReconversionProject with id ${projectId}`);

    const sitesFromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);

    const sitesList = sitesFromLocalStorage
      ? (JSON.parse(sitesFromLocalStorage) as ProjectSite[])
      : [];

    const relatedSite = sitesList.find((site) => site.id === project.relatedSiteId);
    if (!relatedSite) throw new Error(`Could not find Site with id ${project.relatedSiteId}`);

    return { siteData: relatedSite, projectData: project as ProjectForComparison };
  }
}
