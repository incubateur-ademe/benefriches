import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { ProjectFeatures } from "../../domain/projects.types";

export interface ProjectFeaturesGateway {
  getById(projectId: string): Promise<ProjectFeatures>;
}

export const fetchProjectFeatures = createAppAsyncThunk<ProjectFeatures, { projectId: string }>(
  "projectFeatures/fetchProjectFeatures",
  async ({ projectId }, { extra, getState }) => {
    const { projectFeatures } = getState();

    const dataAlreadyFetched =
      projectFeatures.dataLoadingState === "success" && projectFeatures.data?.id === projectId;

    if (dataAlreadyFetched && projectFeatures.data) {
      return Promise.resolve(projectFeatures.data);
    }

    return await extra.projectFeaturesService.getById(projectId);
  },
);
