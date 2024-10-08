import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

import { ReconversionProjectsListGateway } from "../../application/projectsList.actions";
import {
  ProjectDevelopmentPlanType,
  ReconversionProjectsGroupedBySite,
} from "../../domain/projects.types";

export const PROJECTS_LIST_STORAGE_KEY = "benefriches/projects-list";

type ProjectInLocalStorage = {
  id: string;
  name: string;
  type?: ProjectDevelopmentPlanType;
  relatedSiteId: string;
};

export class LocalStorageProjectsListApi implements ReconversionProjectsListGateway {
  async getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    await delay(300);

    const sitesFromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);

    const sitesList = sitesFromLocalStorage
      ? (JSON.parse(sitesFromLocalStorage) as ProjectSite[])
      : [];

    const projectsFromLocalStorage = localStorage.getItem(PROJECTS_LIST_STORAGE_KEY);

    const projectsList = projectsFromLocalStorage
      ? (JSON.parse(projectsFromLocalStorage) as ProjectInLocalStorage[])
      : [];

    return sitesList.map((site) => {
      const projects = projectsList.filter((p) => p.relatedSiteId === site.id);
      return {
        siteId: site.id,
        siteName: site.name,
        isFriche: site.isFriche,
        isExpressSite: site.isExpressSite,
        reconversionProjects: projects.map(({ name, id, type = "PHOTOVOLTAIC_POWER_PLANT" }) => ({
          name,
          id,
          type,
          isExpressProject: false,
        })),
      };
    });
  }
}
