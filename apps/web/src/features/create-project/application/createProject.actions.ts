import { ProjectSite } from "../domain/project.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export interface GetSiteGateway {
  getById(siteId: string): Promise<ProjectSite | undefined>;
}

export const fetchRelatedSiteAction = createAppAsyncThunk<
  ProjectSite,
  ProjectSite["id"]
>("project/fetchRelatedSite", async (siteId, { extra }) => {
  const projectSite = await extra.getSiteService.getById(siteId);

  if (!projectSite) throw new Error("Site not found");

  return projectSite;
});
