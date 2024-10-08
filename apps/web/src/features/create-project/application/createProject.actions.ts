import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { ProjectSite } from "../domain/project.types";

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
