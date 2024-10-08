import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { ProjectFeatures } from "../../domain/projects.types";

export interface ProjectFeaturesGateway {
  getById(projectId: string): Promise<ProjectFeatures>;
}

export const fetchProjectFeatures = createAppAsyncThunk<ProjectFeatures, { projectId: string }>(
  "projectFeatures/fetchProjectFeatures",
  async ({ projectId }, { extra }) => {
    const projectFeatures = await extra.projectFeaturesService.getById(projectId);
    return projectFeatures;
  },
);
