import { ProjectsBySite } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export interface ProjectsListGateway {
  getProjectsListBySite(): Promise<ProjectsBySite[]>;
}

export const fetchProjectsListBySite = createAppAsyncThunk<ProjectsBySite[]>(
  "projects/fetchListBySite",
  async (_, { extra }) => {
    const result = await extra.projectsListService.getProjectsListBySite();
    return result;
  },
);
