import { ProjectFeatures } from "../../domain/projects.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

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
