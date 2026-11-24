import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { ProjectFeatures } from "../../core/projects.types";

export interface ProjectFeaturesGateway {
  getById(projectId: string): Promise<ProjectFeatures>;
}

export const fetchProjectFeatures = createAppAsyncThunk<ProjectFeatures, { projectId: string }>(
  "projectFeatures/fetchProjectFeatures",
  async ({ projectId }, { extra }) => {
    return extra.projectFeaturesService.getById(projectId);
  },
);
