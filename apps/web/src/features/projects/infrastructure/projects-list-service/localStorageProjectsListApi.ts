import { ProjectsListGateway } from "../../application/projectsList.actions";
import { ProjectsList } from "../../domain/projects.types";

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
  async getProjectsList(): Promise<ProjectsList> {
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

    return projectsList.map((project) => {
      const projectSite = sitesList.find(
        (site) => project.relatedSiteId === site.id,
      ) as ProjectSite;
      return {
        id: project.id,
        name: project.name,
        site: { id: projectSite.id, name: projectSite.name },
      };
    });
  }
}
