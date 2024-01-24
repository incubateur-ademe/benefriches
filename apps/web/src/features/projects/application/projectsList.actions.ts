import { ProjectsList, SitesList } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface ProjectsListGateway {
  getProjectsList(): Promise<ProjectsList>;
}

export const fetchProjects = createAppAsyncThunk<ProjectsList>(
  "projects/fetchList",
  async (_, { extra }) => {
    const result = await extra.projectsListService.getProjectsList();
    return result;
  },
);

export interface SitesGateway {
  getSitesList(): Promise<SitesList>;
}

export const fetchSites = createAppAsyncThunk<SitesList>(
  "projects/fetchSites",
  async (_, { extra }) => {
    const result = await extra.sitesService.getSitesList();
    return result;
  },
);
