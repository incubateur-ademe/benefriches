import { ProjectsListGateway } from "../../application/projectsList.actions";
import { ProjectsBySite } from "../../domain/projects.types";

import { ProjectSite } from "@/features/create-project/domain/project.types";
import { SITES_LIST_STORAGE_KEY } from "@/features/create-site/infrastructure/create-site-service/localStorageCreateSiteApi";
import { delay } from "@/shared/services/delay/delay";

const PROJECTS_LIST_STORAGE_KEY = "benefriches/projects-list";

export const groupProjectsBySiteId = (projects: Project[]) => {
  return projects.reduce(
    (grouped, project) => {
      const group = grouped[project.siteId];
      if (group) return { ...grouped, [project.siteId]: [...group, project] };
      return { ...grouped, [project.siteId]: [project] };
    },
    {} as Record<string, Project[]>,
  );
};

export type Project = { id: string; name: string; siteId: string };

const getSiteByIdFromLocalStorage = (siteId: string) => {
  const fromLocalStorage = localStorage.getItem(SITES_LIST_STORAGE_KEY);
  const siteList = fromLocalStorage
    ? (JSON.parse(fromLocalStorage) as ProjectSite[])
    : [];

  if (!siteList) return undefined;

  return siteList.find((site) => site.id === siteId);
};

export class LocalStorageProjectsListApi implements ProjectsListGateway {
  async getProjectsListBySite(): Promise<ProjectsBySite[]> {
    await delay(500);

    const fromLocalStorage = localStorage.getItem(PROJECTS_LIST_STORAGE_KEY);

    const projectsList = fromLocalStorage
      ? (JSON.parse(fromLocalStorage) as Project[])
      : [];

    const projectsBySiteId = groupProjectsBySiteId(projectsList);

    return Object.entries(projectsBySiteId).map(([siteId, projects]) => {
      const siteData = getSiteByIdFromLocalStorage(siteId);
      return { siteId, siteName: siteData?.name ?? "", projects };
    });
  }
}
