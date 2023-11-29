import { ProjectDetailsResult } from "../infrastructure/project-details-service/localStorageProjectDetailsApi";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export interface ProjectsDetailsGateway {
  getProjectById(id: string): Promise<ProjectDetailsResult>;
}

export const fetchProjectDetails = createAppAsyncThunk<
  ProjectDetailsResult,
  string
>("projects/fetchProjectDetails", async (projectId, { extra }) => {
  const result = await extra.projectDetailsService.getProjectById(projectId);
  return result;
});
