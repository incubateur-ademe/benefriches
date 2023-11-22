import { ProjectsListGateway } from "../../application/projectsList.actions";
import { ProjectsBySite } from "../../domain/projects.types";

import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

export const PROJECTS_LIST_STORAGE_KEY = "benefriches/projects-list";

type ProjectInLocalStorage = {
  id: string;
  name: string;
  relatedSiteId: string;
};

export class LocalStorageProjectsListApi implements ProjectsListGateway {
  async getProjectsListBySite(): Promise<ProjectsBySite[]> {
    await delay(500);

    const sitesFromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);

    const sitesList = sitesFromLocalStorage
      ? (JSON.parse(sitesFromLocalStorage) as ProjectSite[])
      : [];

    const projectsFromLocalStorage = localStorage.getItem(
      PROJECTS_LIST_STORAGE_KEY,
    );

    const projectsList = projectsFromLocalStorage
      ? (JSON.parse(projectsFromLocalStorage) as ProjectInLocalStorage[])
      : [];

    const projectsBySiteId = sitesList.map((site) => {
      const projectsOnSite = projectsList.filter(
        (project) => project.relatedSiteId === site.id,
      );
      return { siteId: site.id, siteName: site.name, projects: projectsOnSite };
    });

    return projectsBySiteId;
  }
}
