import { ReconversionProjectsGroupedBySite } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface ReconversionProjectsListGateway {
  getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite>;
}

export const fetchReconversionProjects = createAppAsyncThunk<ReconversionProjectsGroupedBySite>(
  "projects/fetchList",
  async (_, { extra }) => {
    const result = await extra.reconversionProjectsListService.getGroupedBySite();
    return result;
  },
);
