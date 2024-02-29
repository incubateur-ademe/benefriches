import { ReconversionProjectsGroupedBySite } from "../domain/projects.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface ReconversionProjectsListGateway {
  getGroupedBySite({ userId }: { userId: string }): Promise<ReconversionProjectsGroupedBySite>;
}

export const fetchReconversionProjects = createAppAsyncThunk<
  ReconversionProjectsGroupedBySite,
  { userId: string }
>("projects/fetchList", async ({ userId }, { extra }) => {
  const result = await extra.reconversionProjectsListService.getGroupedBySite({
    userId,
  });
  return result;
});
