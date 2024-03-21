import { ProjectSite } from "../domain/project.types";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface GetSitesByIdGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const fetchRelatedSite = createAppAsyncThunk<ProjectSite, ProjectSite["id"]>(
  "project/fetchRelatedSite",
  async (siteId, { extra }) => {
    const projectSite = await extra.getSiteByIdService.getById(siteId);

    if (!projectSite) throw new Error("Site not found");

    return projectSite;
  },
);
