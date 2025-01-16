import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ProjectSite } from "./project.types";

export interface GetSitesByIdGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const projectCreationInitiated = createAppAsyncThunk<ProjectSite, { relatedSiteId: string }>(
  "project/projectCreationInitiated",
  async ({ relatedSiteId }, { extra }) => {
    const projectSite = await extra.getSiteByIdService.getById(relatedSiteId);

    if (!projectSite) throw new Error("Site not found");

    return projectSite;
  },
);
